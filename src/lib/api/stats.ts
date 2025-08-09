import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface FileTypeStats {
  type: string;
  count: number;
}

export const stats = {
  async getFileTypeBreakdown(token: string): Promise<FileTypeStats[]> {
    const response = await axios.get(`${API_URL}/files/stats/types`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
