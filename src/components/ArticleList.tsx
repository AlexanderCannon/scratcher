interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
}

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {articles.map((article) => (
        <div
          key={article.id}
          className="overflow-hidden rounded-lg bg-white shadow-md"
        >
          <img
            className="h-48 w-full object-cover"
            src={article.image}
            alt=""
          />
          <div className="p-6">
            <h2 className="mb-2 text-2xl font-bold">{article.title}</h2>
            <p className="text-gray-600">{article.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
