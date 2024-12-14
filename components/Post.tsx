'use client';
import { useState } from 'react';
import styles from './Post.module.css';

interface PostProps {
	id: string;
	title: string;
	content: string;
	// Add other props as needed
}

export default function Post({ id, title, content }: PostProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState(content);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = async () => {
		// Add your API call here to save the changes
		setIsEditing(false);
	};

	const handleDelete = async () => {
		if (confirm('Are you sure you want to delete this post?')) {
			// Add your API call here to delete the post
			console.log('Deleting post:', id);
		}
	};

	return (
		<div className={styles.post}>
			<h2>{title}</h2>

			{isEditing ? (
				<>
					<textarea
						value={editedContent}
						onChange={(e) => setEditedContent(e.target.value)}
						className={styles.editInput}
					/>
					<button onClick={handleSave} className={styles.editBtn}>
						Save
					</button>
				</>
			) : (
				<>
					<p>{content}</p>
					<div className={styles.postActions}>
						<button onClick={handleEdit} className={styles.editBtn}>
							Edit
						</button>
						<button onClick={handleDelete} className={styles.deleteBtn}>
							Delete
						</button>
					</div>
				</>
			)}
		</div>
	);
}