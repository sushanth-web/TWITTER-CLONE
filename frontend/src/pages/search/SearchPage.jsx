import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const SearchPage = () => {
	const [query, setQuery] = useState("");

	const { data: users = [], isLoading } = useQuery({
		queryKey: ["searchUsers", query],
		queryFn: async () => {
			if (!query) return [];
			const res = await fetch(`/api/users/search?q=${query}`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			return data;
		},
		enabled: !!query,
	});

	return (
		<div className='flex-[4_4_0] border-r border-gray-700 min-h-screen p-4'>
			<input
				type='text'
				placeholder='Search users'
				className='w-full p-3 rounded-full bg-gray-700 border border-gray-700 outline-none'
				value={query}
				onChange={(e) => setQuery(e.target.value)}
			/>

			<div className='mt-4 flex flex-col gap-3'>
				{isLoading && <p className='text-sm text-gray-400'>Searching...</p>}

				{users.map((user) => (
					<Link
						key={user._id}
						to={`/profile/${user.username}`}
						className='flex items-center gap-3 p-3 hover:bg-secondary rounded-lg transition'
					>
						<img
							src={user.profileImg || "/avatar-placeholder.png"}
							className='w-10 h-10 rounded-full'
						/>
						<div>
							<p className='font-bold'>{user.fullName}</p>
							<p className='text-sm text-slate-500'>@{user.username}</p>
						</div>
					</Link>
				))}

				{query && users.length === 0 && !isLoading && (
					<p className='text-center text-sm text-gray-500'>No users found</p>
				)}
			</div>
		</div>
	);
};

export default SearchPage;
