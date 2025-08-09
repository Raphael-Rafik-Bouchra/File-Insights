import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface FileUploadResponse {
  id: string;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  url: string;
  type: string;
  size: number;
  createdAt: string;
}

export interface FileListParams {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}

export interface FileListResponse {
  items: FileUploadResponse[];
  total: number;
  page: number;
  limit: number;
}

export const files = {
  async upload(file: File, token: string): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/files/upload`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async list(params: FileListParams, token: string): Promise<FileListResponse> {
    const response = await axios.get(`${API_URL}/files`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getById(id: string, token: string): Promise<FileUploadResponse> {
    const response = await axios.get(`${API_URL}/files/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
