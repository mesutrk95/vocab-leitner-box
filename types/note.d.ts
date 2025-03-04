
export type Note = {
  id?: string;
  title?: string;
  formattedContent: {
    description?: string;
    moreDetail?: string;
  };
  description?: string;
  moreDetail?: string;
  createdAt?: string;
  updatedAt?: string;
};