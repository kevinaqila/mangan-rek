import { formatMessageTime } from "../lib/utils";

const Comment = ({ rating }) => {
  return (
    <div>
      <div className="mb-3">
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700">
            {/* Avatar User */}
            <img
              src={rating.user.profilePic || "images/avatar.png"}
              alt={rating.user.fullName}
              className="w-12 h-12 rounded-full border border-gray-600"
            />

            {/* Detail Komentar */}
            <div className="flex-1">
              {/* Header Komentar */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-100">{rating.user.fullName}</p>
                  <span className="text-sm text-gray-400">{formatMessageTime(rating.createdAt)}</span>
                </div>
                {/* Rating */}
                <div className="flex items-center gap-1 text-yellow-500">
                  {Array.from({ length: rating.rate }, (_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.4 8.168-7.334-3.857-7.334 3.857 1.4-8.168-5.934-5.782 8.2-1.192z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Isi Komentar */}
              <p className="text-gray-300 mt-2">{rating.text}</p>

              {/* Gambar Komentar */}
              {rating.image && rating.image.length > 0 && (
                <div className="mt-4 ">
                  <img
                    src={rating.image}
                    alt="Komentar Gambar"
                    className="w-64 h-40 object-cover rounded-lg border border-gray-700"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
