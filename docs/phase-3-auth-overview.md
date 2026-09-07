# סקירת קוד — Authentication UI (Phase 3)

מסמך לעזרה בהסבר ובשליטה על מה שהוסף ב-Phase 3.

הרעיון בגדול: **הדף לא מדבר עם השרת.** הוא רק טופס. מתחתיו יש שכבות ברורות, וכל אחת אחראית על דבר אחד.

```text
דף (Login / Register)
    ↓ React Hook Form + Zod
Custom Hook (useLogin / useRegister)
    ↓ TanStack Query mutation
auth.api.ts
    ↓ Axios
הבקאנד
```

מצב המשתמש המחובר נשמר ב־**Zustand בלבד**, לא ב־Query ולא ב־Context.

---

## 1. הדפים — מה המשתמש רואה

שלושת הדפים הציבוריים נמצאים ב־`client/src/pages/public/`.

| כתובת | קובץ | מה זה |
|---|---|---|
| `/` | `HomePage.tsx` | דף נחיתה. לא טופס. |
| `/login` | `LoginPage.tsx` | כניסה: אימייל + סיסמה |
| `/register` | `RegisterPage.tsx` | הרשמה: שם, אימייל, סיסמה, אישור סיסמה |

`AuthCard.tsx` הוא רק עטיפה ויזואלית משותפת (כותרת, כרטיס, קישור למטה). Login ו-Register נשארים דפים נפרדים.

**HomePage:** אם מנותקים, Start Learning הולך ל־`/register`. אם מחוברים — ל־`/dashboard`.

**Login / Register עושים אותו דבר באותו סדר:**

1. `useForm` + `zodResolver` — ולידציה בצד הלקוח לפני שליחה.
2. `handleSubmit` מפעיל `onSubmit` רק אם Zod עבר.
3. ה-hook שולח לשרת.
4. הצלחה → ניווט ל־`/dashboard`.
5. שגיאת שרת → מוצגת מה-mutation, לא מהטופס.

ב-Register חשוב להסביר: יש שדה `confirmPassword` בטופס, **אבל הוא לא נשלח לשרת**. ב־`onSubmit` שולחים רק `{ name, email, password }`.

---

## 2. הולידציה — Zod

`client/src/schemas/auth.schema.ts`

זה החוזה של הטופס. הוא מחקה את חוקי הבקאנד:

- שם: אותיות יוניקוד ורווחים, 2–100 תווים
- אימייל: חובה, פורמט תקין, trim + lowercase
- סיסמה: מינימום **4** תווים
- ב-Register: Confirm חייב להיות זהה לסיסמה

אם Zod נכשל, הבקשה **לא יוצאת** לשרת. לכן שגיאת "3 תווים" היא שגיאת טופס, לא 400 מה-API.

---

## 3. ה-hooks — הגשר בין הדף לשרת

`client/src/hooks/useAuth.ts` מכיל שלושה hooks קטנים:

**`useAuth()`** — קריאה בלבד + התנתקות  
מחזיר `user`, `token`, `isAuthenticated`, `logout`.  
ה-Navbar משתמש בזה.

**`useLogin()` / `useRegister()`** — TanStack Query mutations  
- `mutationFn` קורא ל־`auth.api.ts`
- `retry: 0` — לא מנסים שוב סיסמה שגויה
- `onSuccess` שומר `user` + `token` ב-Zustand
- `isPending` / `error` מגיעים לדף (כפתור disabled, הודעת שגיאה)

המשתמש והטוקן **לא** נשמרים ב-Query cache. Query מנהל רק את מצב הבקשה (טוען / הצליח / נכשל).

---

## 4. שכבת ה-API

`client/src/api/auth.api.ts`

שתי פונקציות בלבד:

- `POST /users/register`
- `POST /users/login`

ה-base URL כבר כולל `/api`, אז זה מגיע ל־`/api/users/register`.

התשובה האמיתית מהבקאנד:

```json
{ "status": "success", "user": { ... }, "token": "..." }
```

אין עטיפת `data`. Axios שם את ה-JSON ב־`response.data`, ולכן קוראים `data.user` ו־`data.token`.

הדפים לא מייבאים Axios. רק המודול הזה.

---

## 5. Zustand — מי מחובר עכשיו

`client/src/store/authStore.ts` הוא מקור האמת היחיד ל-auth.

בזיכרון: `user`, `token`, `isAuthenticated`  
ב-localStorage: אותם מפתחות, `user` ו-`token`

| פעולה | מה קורה |
|---|---|
| `login(user, token)` | שומר בזיכרון + localStorage |
| `logout()` | מוחק משניהם |
| רענון דף | הקובץ רץ מחדש, קורא מ-localStorage, ומשחזר session |

אין endpoint בשם `/me`. אחרי refresh אין קריאה לשרת "מי אני" — רק שחזור מהאחסון המקומי.

`isAuthenticated` = יש user תקין **וגם** token לא ריק.

---

## 6. Axios + JWT

`client/src/lib/axios.ts`

לפני כל בקשה, interceptor בודק את הטוקן ב-Zustand. אם יש — מוסיף:

```http
Authorization: Bearer <token>
```

לכן אחרי login/register, בקשות הבאות (categories וכו') כבר יוצאות מאומתות.

**אין** interceptor של 401 שמנתק אוטומטית. 401 בלוגין = סיסמה שגויה, לא "הטוקן פג".

---

## 7. ניתוב — מי מורשה לראות מה

`client/src/router/index.tsx`

שלושה שומרים:

| שומר | קובץ | כלל |
|---|---|---|
| `GuestRoute` | רק `/login`, `/register` | אם כבר מחוברים → `/dashboard` |
| `ProtectedRoute` | dashboard, history, categories... | אם מנותקים → `/login` |
| `AdminRoute` | `/admin/*` | מנותק → `/login`. USER → `/unauthorized`. ADMIN → נכנס |

`/` (הנחיתה) **לא** מאחורי GuestRoute, כדי שמשתמש מחובר עדיין יוכל לראות את דף הבית.

`role` מגיע מהאובייקט `user` שהבקאנד החזיר. הפרונט לא מפענח JWT ולא נותן לבחור ADMIN בהרשמה.

---

## 8. התנתקות

כפתור **Logout** ב-Navbar (רק בעמודים הפנימיים: Dashboard, History, Admin וכו'). בדף הנחיתה `/` אין כפתור התנתקות.

`useAuth().logout()` עושה שלושה דברים:

1. מוחק user/token מ-Zustand ו-localStorage
2. מנקה את TanStack Query
3. `window.location.replace('/')` — חוזר לדף הנחיתה

ה-reload המלא נחוץ כי אם רק עושים `navigate('/')` בזמן שנמצאים ב-dashboard, `ProtectedRoute` רואה שכבר אין auth ומפנה ל־`/login` באותו רגע.

---

## 9. שגיאות

`getApiErrorMessage` ב־`lib/apiError.ts` קורא את ההודעה מהבקאנד:

```json
{ "status": "error", "message": "..." }
```

למשל 401 → `Invalid email or password.`  
409 → `A user with this email already exists.`

אם אין הודעה בטוחה: `Something went wrong. Please try again.`

יש שני סוגים בדף:

- שגיאת שדה (Zod) — מתחת ל-input
- שגיאת שרת — באנר אדום מעל הכפתור

---

## משפט לסכם (אם צריך להסביר בעל פה)

> המשתמש ממלא טופס. Zod בודק אותו. Hook שולח mutation. ה-API מדבר עם הבקאנד. אם חוזרים user ו-token, Zustand שומר אותם גם ב-localStorage. מכאן ה-router יודע אם להכניס ל-dashboard, לחסום admin, או להעיף אורח חזרה ללוגין. אחרי רענון אין `/me` — פשוט קוראים שוב מ-localStorage.
