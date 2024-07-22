import { Link } from "react-router-dom";

const Categories = () => {
	return (
		<div className="flex flex-col gap-y-2 text-white items-center p-5 min-w-[380px] bg-slate-900 no-scrollbar">
			<Link
				to={"/"}
				className="text-white bg-pink-600 px-2 py-1 rounded self-start font-semibold"
			>
				<i className="ri-arrow-left-s-fill"></i> Back
			</Link>
			<h1 className="text-lg font-semibold">Category Manager</h1>
            <p className="text-gray-400 font-bold">Comming Soon !!</p>
		</div>
	);
};

export default Categories;
