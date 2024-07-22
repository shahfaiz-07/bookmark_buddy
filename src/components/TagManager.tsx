import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate} from "react-router-dom";
import { setAdd, setCategory, setId, setTitle, setUrl } from "../features/tagSlice";

interface Bookmark {
    id: string;
    title: string;
    url: string;
    category: string;
}

const TagManager: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [currentCategory, setCurrentCategory] = useState('All');
    const categories = ['All', 'Uncategorized', 'Work', 'Personal', 'Important', 'Other'];

    const handleRemove = (bookmarkId: string) => {
        chrome.bookmarks.remove(bookmarkId, () => {
            chrome.storage.sync.remove(bookmarkId)
        })
    }
    const handleEdit = (bookmark: Bookmark) => {
        console.log(bookmark)
        dispatch(setAdd(false))
        dispatch(setTitle(bookmark.title))
        dispatch(setId(bookmark.id))
        dispatch(setCategory(bookmark.category))
        dispatch(setUrl(bookmark.url))
        navigate('/adder')
    }
    useEffect(() => {
        chrome.bookmarks.getTree(async (bookmarkTreeNodes) => {
            const bookmarkList: Bookmark[] = [];
            const bookmarkPromises: Promise<void>[] = [];

            const traverseBookmarks = (nodes: chrome.bookmarks.BookmarkTreeNode[]) => {
                nodes.forEach((node) => {
                    if (node.url) {
                        const bookmarkPromise = new Promise<void>((resolve) => {
                            chrome.storage.sync.get([node.id], (result) => {
                                const category = result[node.id] || 'Uncategorized';
                                bookmarkList.push({
                                    id: node.id,
                                    title: node.title || "",
                                    url: node.url || "",
                                    category
                                });
                                resolve();
                            });
                        });
                        bookmarkPromises.push(bookmarkPromise);
                    }
                    if (node.children) {
                        traverseBookmarks(node.children);
                    }
                });
            };

            traverseBookmarks(bookmarkTreeNodes);
            await Promise.all(bookmarkPromises);
            setBookmarks(bookmarkList);
        });
    }, [handleRemove]);

    return (
        <div className="flex flex-col gap-y-2 text-white items-center p-5 min-w-[380px] bg-slate-900 no-scrollbar">
            <Link to={"/"} className="text-white bg-pink-600 px-2 py-1 rounded self-start font-semibold">
            <i className="ri-arrow-left-s-fill"></i> Back
            </Link>
            <h1 className="text-lg font-semibold">Bookmark List</h1>
            <div className="flex gap-x-2 items-center">
                <label htmlFor="filter" className="text-base font-semibold">Filter :</label>
                <select name="filter" id="filter" className="text-sm rounded px-2 py-1 bg-transparent border" value={currentCategory} onChange={(e) => setCurrentCategory(e.target.value)}>
                    {
                        categories.map(category => (
                            <option key={category} value={category} className="text-black">{category}</option>
                        ))
                    }
                </select>
            </div>
            <ul className="list-disc flex flex-col gap-y-2 w-full no-scrollbar">
                {currentCategory === "All"
                ? 
                bookmarks.map((bookmark: Bookmark) => (
                    <li key={bookmark.id} className="flex justify-between gap-x-2 items-center w-full">
                        <a className="text-md font-bold hover:underline hover:text-blue-500" href={bookmark.url} target="_blank">
                            {bookmark.title}
                        </a>
                        <div className="flex gap-x-2 items-center">
                            <p className="rounded-full px-2 py-1 bg-green-600 text-[10px] font-semibold">{bookmark.category}</p>
                            <button className="aspect-square w-7 h-7 grid place-content-center rounded-full bg-yellow-500" onClick={() => handleEdit(bookmark)}>
                            <i className="ri-pencil-fill text-sm"></i>
                            </button>
                            <button className="aspect-square w-7 h-7 grid place-content-center rounded-full bg-red-800" onClick={() => handleRemove(bookmark.id)}>
                            <i className="ri-delete-bin-6-line text-sm"></i>
                            </button>
                        </div>
                    </li>
                ))
            :
            bookmarks.filter(bookmark => bookmark.category === currentCategory).map((bookmark: Bookmark) => (
                <li key={bookmark.id} className="flex justify-between gap-x-2 items-center w-full">
                        <a className="text-md font-bold hover:underline hover:text-blue-500" href={bookmark.url} target="_blank">
                            {bookmark.title}
                        </a>
                        <div className="flex gap-x-2 items-center">
                            <p className="rounded-full px-2 py-1 bg-green-600 text-[10px] font-semibold">{bookmark.category}</p>
                            <button className="aspect-square w-7 h-7 grid place-content-center rounded-full bg-yellow-500" onClick={() => handleEdit(bookmark)}>
                            <i className="ri-pencil-fill text-sm"></i>
                            </button>
                            <button className="aspect-square w-7 h-7 grid place-content-center rounded-full bg-red-800" onClick={() => handleRemove(bookmark.id)}>
                            <i className="ri-delete-bin-6-line text-sm"></i>
                            </button>
                        </div>
                </li>
            ))}
            </ul>
        </div>
    );
};

export default TagManager;
