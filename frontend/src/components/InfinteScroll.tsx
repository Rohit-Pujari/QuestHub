import React, { useEffect, useRef, useState } from "react";

interface InfiniteScrollProps {
    fetchMoreData: () => void;
    hasMore: boolean;
    children: React.ReactNode;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ fetchMoreData, hasMore, children }) => {
    const observerRef = useRef<HTMLDivElement | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (!hasMore) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetching) {
                    setIsFetching(true);
                    fetchMoreData();
                }
            },
            { rootMargin: "100px" }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            observer.disconnect();
        }
    }, [hasMore, isFetching]);

    return (
        <div className="w-full overflow-y-auto custom-scrollbar">
            {children}
            {hasMore && (
                <div ref={observerRef} className="text-center p-4 text-gray-500 dark:text-gray-400">
                    Loading more...
                </div>
            )}
        </div>
    );

};

export default InfiniteScroll;
