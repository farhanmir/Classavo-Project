import Link from 'next/link';

export default function ChapterList({ chapters, courseId, isInstructor, isEnrolled }) {
  return (
    <div className="space-y-2">
      {chapters.map((chapter) => {
        const isAccessible = chapter.is_public || isInstructor || isEnrolled;

        return (
          <div
            key={chapter.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              isAccessible
                ? 'bg-white hover:bg-gray-50 border-gray-200'
                : 'bg-gray-100 border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-4 flex-1">
              <span className="text-gray-500 font-semibold">
                {chapter.order}.
              </span>

              <div className="flex-1">
                {isAccessible ? (
                  <Link
                    href={`/courses/${courseId}/chapters/${chapter.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {chapter.title}
                  </Link>
                ) : (
                  <span className="text-gray-500 font-medium">
                    {chapter.title}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {chapter.is_public ? (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Public
                  </span>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span className="text-xs">Private</span>
                  </div>
                )}
              </div>
            </div>

            {isInstructor && (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  href={`/courses/${courseId}/chapters/${chapter.id}/edit`}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit chapter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        );
      })}

      {chapters.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No chapters available yet.
        </p>
      )}
    </div>
  );
}
