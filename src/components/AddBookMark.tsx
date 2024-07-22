import { RootState } from "../app/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { resetTagData } from "../features/tagSlice";

const AddBookMark = () => {
	const categories = [
		"Uncategorized",
		"Work",
		"Personal",
		"Important",
		"Other",
	];
	const { id, add, title, url, category } = useSelector(
		(state: RootState) => state.tag
	);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [localUrl, setUrl] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [localCategory, setCategory] = useState<string>(categories[0]);
	useEffect(() => {
		if (add) {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				if (tabs[0].url) {
					setUrl(tabs[0].url);
				}
				if (tabs[0].title) {
					setName(tabs[0].title);
				}
			});
		} else {
			console.log("Editing.....");
			setUrl(url);
			setName(title);
			setCategory(category);
		}
	}, []);

	const handleSubmit = () => {
		if (add) {
			chrome.bookmarks.create({ title: name, url: localUrl }, (bookmark) => {
                console.log(bookmark)
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError.message);
					return;
				}

				if (!bookmark || !bookmark.id) {
					console.error(
						"Bookmark creation failed or bookmark object is invalid."
					);
					return;
				}

				chrome.storage.sync.set({ [bookmark.id]: localCategory }, () => {
					if (chrome.runtime.lastError) {
						console.error(chrome.runtime.lastError.message);
					} else {
						console.log("Category changed successfully.");
					}
				});
				setUrl("");
				setName("");
				setCategory(categories[0]);
			});
		} else {
			chrome.bookmarks.update(id, { title: name }, (bookmark) => {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError.message);
					return;
				}

				if (!bookmark || !bookmark.id) {
					console.error(
						"Bookmark creation failed or bookmark object is invalid."
					);
					return;
				}
				console.log("Setting ", bookmark.id, "to", localCategory);
				chrome.storage.sync.set({ [bookmark.id]: localCategory }, () => {
					if (chrome.runtime.lastError) {
						console.error(chrome.runtime.lastError.message);
					} else {
						console.log("Category edited successfully.");
					}
				});
				setUrl("");
				setName("");
				setCategory(categories[0]);
			});
			dispatch(resetTagData());
		}
		navigate("/manager");
	};

	return (
		<div className="flex flex-col gap-y-2 text-white items-center justify-center p-5 min-w-[380px] bg-slate-900">
			<Link
				to={"/"}
				className="text-white bg-pink-600 px-2 py-1 rounded self-start font-semibold"
			>
				<i className="ri-arrow-left-s-fill"></i> Back
			</Link>
			<h1 className="text-lg font-semibold">Add Bookmark</h1>
			<div className="flex gap-x-2 items-center justify-between w-full">
				<label htmlFor="url" className="font-semibold w-[20%]">
					URL:
				</label>
				<input
					id="url"
					type="text"
					placeholder="Bookmark URL"
					value={localUrl}
					className="px-2 py-1 text-sm rounded bg-transparent bg-opacity-25 border w-[75%]"
					onChange={(e) => setUrl(e.target.value)}
					disabled={!add}
				/>
			</div>

			<div className="flex gap-x-2 items-center justify-between  w-full">
				<label htmlFor="title" className="font-semibold w-[20%]">
					Title:
				</label>
				<input
					type="text"
					id="title"
					placeholder="Bookmark Title"
					value={name}
					className="px-2 py-1 text-sm rounded bg-transparent bg-opacity-25 border w-[75%]"
					onChange={(e) => setName(e.target.value)}
				/>
			</div>

			<div className="flex gap-x-2 items-center justify-between w-full">
				<label htmlFor="category" className="font-semibold w-[20%]">
					Category:
				</label>
				<select
					value={localCategory}
					onChange={(e) => setCategory(e.target.value)}
					className="px-2 py-1 text-sm rounded bg-transparent bg-opacity-25 border w-[75%]"
					id="category"
				>
					{categories.map((category) => (
						<option key={category} value={category} className="text-black">
							{category}
						</option>
					))}
				</select>
			</div>

			<button
				onClick={handleSubmit}
				className="px-3 py-2 rounded-full bg-red-600 mt-3 font-semibold text-md"
			>
				{add ? "Add Bookmark " : "Save Changes "} <i className="ri-bookmark-fill"></i>
			</button>
		</div>
	);
};

export default AddBookMark;
