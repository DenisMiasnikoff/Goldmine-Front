"use client";
import { useRef } from 'react';
import { createPost } from "../../_lib/actions";

interface CreatePostFormProps {
  dungeonId: string;
  token: string | null;
}

export default function CreatePostForm({ dungeonId, token }: CreatePostFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleAction = async (formData: FormData) => {
    if (!token) return;
    await createPost(formData, dungeonId, token);
    
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <form ref={formRef} action={handleAction} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
      <input 
        type="text" 
        name="title" 
        placeholder="Title of post" 
        required 
        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      
      <textarea 
        name="content" 
        placeholder="Describe the post" 
        required 
        rows={4}
        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      
      <button 
        type="submit"
        style={{ padding: '10px 15px', backgroundColor: '#ffd700', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        Make a post
      </button>
    </form>
  );
}