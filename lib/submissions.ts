export type Submission = {
  id: number;
  groupNumber: string;
  contentType: string;
  submitterName: string;
  title: string;
  body: string;
  imageKey: string | null;
  status: string;
  adminNote: string;
  createdAt: string;
};

// Provider-neutral placeholder used by the open-source package.
// Replace these functions with Tencent CloudBase or another database adapter.
export async function approved(): Promise<Submission[]> {
  return [];
}

export async function allSubmissions(): Promise<Submission[]> {
  return [];
}
