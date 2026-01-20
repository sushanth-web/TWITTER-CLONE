import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";


const NotificationPage = () => {
	const queryClient = useQueryClient();
	const authUser = queryClient.getQueryData(["authUser"]);

	/* 🔹 Notifications query */
	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			const res = await fetch("/api/notifications");
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
	});

	/* 🔹 Delete all notifications */
	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/notifications", { method: "DELETE" });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		onSuccess: () => {
			toast.success("All notifications deleted");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});

	/* 🔹 Delete SINGLE notification */
	const { mutate: deleteSingleNotification, isPending } = useMutation({
		mutationFn: async (notificationId) => {
			const res = await fetch(`/api/notifications/${notificationId}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		onSuccess: () => {
			toast.success("Notification deleted");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});

	return (
		<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
			{/* Header */}
			<div className='flex justify-between items-center p-4 border-b border-gray-700'>
				<p className='font-bold'>Notifications</p>

				<div className='dropdown'>
					<div tabIndex={0} role='button'>
						<IoSettingsOutline className='w-4' />
					</div>
					<ul className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52'>
						<li>
							<a onClick={deleteNotifications}>Delete all notifications</a>
						</li>
					</ul>
				</div>
			</div>

			{/* Loading */}
			{isLoading && (
				<div className='flex justify-center items-center h-full'>
					<LoadingSpinner size='lg' />
				</div>
			)}

			{/* Empty state */}
			{notifications?.length === 0 && (
				<div className='text-center p-4 font-bold'>No notifications 🤔</div>
			)}

			{/* Notification list */}
			{notifications?.map((notification) => (
				<div className='border-b border-gray-700' key={notification._id}>
					<div className='flex gap-2 p-4 items-center'>
						{notification.type === "follow" && (
							<FaUser className='w-7 h-7 text-primary' />
						)}
						{notification.type === "like" && (
							<FaHeart className='w-7 h-7 text-red-500' />
						)}

						<Link to={`/profile/${notification.from.username}`} className='flex gap-2 flex-1'>
							<div className='avatar'>
								<div className='w-8 rounded-full'>
									<img
										src={notification.from.profileImg || "/avatar-placeholder.png"}
										alt='profile'
									/>
								</div>
							</div>

							<div>
								<span className='font-bold'>@{notification.from.username}</span>{" "}
								{notification.type === "follow"
									? "followed you"
									: "liked your post"}
							</div>
						</Link>

						{/* ✅ Single delete button */}
						{authUser?._id === notification.to && (
							<button
								onClick={() => deleteSingleNotification(notification._id)}
								disabled={isPending}
								className='hover:text-red-500'
							>
								{isPending ? <LoadingSpinner size='sm' /> : <FaTrash />}
							</button>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default NotificationPage;
