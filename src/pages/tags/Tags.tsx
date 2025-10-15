import { useState, useEffect } from 'react';
import { Edit, Trash2, GitMerge, Tag as TagIcon, Search } from 'lucide-react';
import {
  useTags,
  useUpdateTag,
  useMergeTag,
  useDeleteTag,
} from './useTags';
import TagMergeModal from './components/TagMergeModal';
import TagUpdateModal from './components/TagUpdateModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { TagWithTransactions } from './tag';
import { useQueryClient } from '@tanstack/react-query';

function Tags() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(6);
  const [selectedTag, setSelectedTag] = useState<TagWithTransactions | null>(null);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const queryClient = useQueryClient();

  // 🕒 Debounce search input to avoid excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 🔍 Fetch tags (uses cached data)
  const { data: tagsData, isLoading, isFetching } = useTags(debouncedQuery, currentPage, pageSize);

  const updateTag = useUpdateTag();
  const mergeTag = useMergeTag();
  const deleteTag = useDeleteTag();

  const tags = tagsData?.content || [];
  const totalPages = tagsData?.totalPages || 0;

  // ⚡️ Prefetch next page for smooth pagination
  useEffect(() => {
    if (currentPage < totalPages - 1) {
      queryClient.prefetchQuery({
        queryKey: ['tags', { key: debouncedQuery, page: currentPage + 1, size: pageSize }],
        queryFn: async () => {
          const response = await fetch(
            `/api/v1/tags/search?key=${encodeURIComponent(debouncedQuery)}&page=${currentPage + 1}&size=${pageSize}`
          );
          const data = await response.json();
          return data.data;
        },
      });
    }
  }, [currentPage, debouncedQuery, pageSize, totalPages, queryClient]);

  // ✏️ Update
  const handleUpdateTag = async (name: string) => {
    if (selectedTag) {
      try {
        await updateTag.mutateAsync({ id: selectedTag.tag.id, data: { name } });
        setIsUpdateModalOpen(false);
        setSelectedTag(null);
      } catch (error) {
        console.error('Failed to update tag:', error);
      }
    }
  };

  // 🔗 Merge
  const handleMergeTag = async (targetTagId: string) => {
    if (selectedTag) {
      try {
        await mergeTag.mutateAsync({
          id: selectedTag.tag.id,
          data: { tagId: targetTagId },
        });
        setIsMergeModalOpen(false);
        setSelectedTag(null);
      } catch (error) {
        console.error('Failed to merge tags:', error);
      }
    }
  };

  // 🗑️ Delete
  const handleDeleteTag = async () => {
    if (selectedTag) {
      try {
        await deleteTag.mutateAsync(selectedTag.tag.id);
        setIsDeleteModalOpen(false);
        setSelectedTag(null);
      } catch (error) {
        console.error('Failed to delete tag:', error);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tags</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Organize your transactions with custom tags
          </p>
        </div>

        {/* 🔍 Search bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tags..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Tags List */}
      {isLoading ? (
        <div className="animate-pulse grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          ))}
        </div>
      ) : tags.length === 0 ? (
        <div className="p-10 text-center text-gray-500 dark:text-gray-400">
          <TagIcon className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No tags found
          </h3>
          <p className="text-sm mb-4">
            {searchQuery
              ? 'Try adjusting your search query.'
              : 'Start organizing your transactions by creating tags.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tags.map((item) => (
            <div
              key={item.tag.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-4 flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.tag.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.transactions > 0 && (
                    <>
                      {item.transactions} transaction
                      {item.transactions !== 1 ? 's' : ''}
                    </>
                  )}
                  {item.transactions > 0 && item.scheduledTransactions > 0 && ' · '}
                  {item.scheduledTransactions > 0 && (
                    <>{item.scheduledTransactions} scheduled</>
                  )}
                  {item.transactions === 0 &&
                    item.scheduledTransactions === 0 &&
                    'No usage yet'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedTag(item);
                    setIsMergeModalOpen(true);
                  }}
                  disabled={tags.length <= 1}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600 disabled:opacity-50 transition"
                >
                  <GitMerge className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedTag(item);
                    setIsUpdateModalOpen(true);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-indigo-600 transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedTag(item);
                    setIsDeleteModalOpen(true);
                  }}
                  disabled={deleteTag.isPending}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-600 disabled:opacity-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2 items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          className="px-3 py-1 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Prev
        </button>

        <span className="px-3 py-1 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
          {currentPage + 1} / {totalPages || 1}
          {isFetching && <span className="ml-2 text-xs text-gray-400">(updating...)</span>}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
          }
          disabled={currentPage >= totalPages - 1}
          className="px-3 py-1 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>

      {/* Modals */}
      {selectedTag && (
        <>
          <TagMergeModal
            isOpen={isMergeModalOpen}
            onClose={() => {
              setIsMergeModalOpen(false);
              setSelectedTag(null);
            }}
            sourceTag={selectedTag}
            availableTags={tags}
            onMerge={handleMergeTag}
            isPending={mergeTag.isPending}
          />

          <TagUpdateModal
            isOpen={isUpdateModalOpen}
            onClose={() => {
              setIsUpdateModalOpen(false);
              setSelectedTag(null);
            }}
            tag={selectedTag}
            onUpdate={handleUpdateTag}
            isPending={updateTag.isPending}
          />

          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedTag(null);
            }}
            onConfirm={handleDeleteTag}
            title="Delete Tag"
            message={`Are you sure you want to delete "${selectedTag.tag.name}"? This tag is used in ${selectedTag.transactions} transaction(s). This action cannot be undone.`}
            confirmText="Delete Tag"
            confirmButtonClass="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            isPending={deleteTag.isPending}
          />
        </>
      )}
    </div>
  );
}

export default Tags;