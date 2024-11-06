export interface IPost { // Ou PostInterface ou PostData
  title: string
  content: string
  image: string
}
export interface IComment {
  id: number; // Ou string, dependendo de como o ID é gerado no backend
  content: string;
}