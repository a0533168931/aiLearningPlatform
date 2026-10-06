import type { ApiSuccess } from '../types/api';
import type {
  CreatePromptRequest,
  Prompt,
  PromptWithRelations,
} from '../types/prompt';
import api from './client';
import { unwrapData } from './parse';

export async function create(input: CreatePromptRequest): Promise<Prompt> {
  const { data } = await api.post<ApiSuccess<Prompt>>('/prompts/create', {
    categoryId: input.categoryId,
    subCategoryId: input.subCategoryId,
    prompt: input.prompt,
  });
  return unwrapData(data);
}

export async function getHistory(userId: number): Promise<PromptWithRelations[]> {
  const { data } = await api.get<ApiSuccess<PromptWithRelations[]>>(
    `/prompts/history/${userId}`
  );
  return unwrapData(data);
}

export async function getById(promptId: number): Promise<PromptWithRelations> {
  const { data } = await api.get<ApiSuccess<PromptWithRelations>>(
    `/prompts/promptId/${promptId}`
  );
  return unwrapData(data);
}

export async function getByCategory(
  categoryId: number
): Promise<PromptWithRelations[]> {
  const { data } = await api.get<ApiSuccess<PromptWithRelations[]>>(
    `/prompts/categoryId/${categoryId}`
  );
  return unwrapData(data);
}
