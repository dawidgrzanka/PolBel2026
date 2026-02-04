import React, { useState } from 'react';
import { polbelApi} from '@/api/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, User } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function CommentSection({ postId, comments = [] }) {
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: (data) => polbelApi.entities.BlogComment.create(data),
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ author_name: '', author_email: '', content: '' });
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createCommentMutation.mutate({
      ...formData,
      post_id: postId,
      approved: false
    });
  };

  const approvedComments = comments.filter(c => c.approved);

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-[#d4a84b]" />
        Komentarze ({approvedComments.length})
      </h3>

      {/* Comments List */}
      {approvedComments.length > 0 ? (
        <div className="space-y-6 mb-10">
          {approvedComments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#d4a84b]/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#d4a84b]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{comment.author_name}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(comment.created_date), 'd MMMM yyyy, HH:mm', { locale: pl })}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 pl-13">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-8">Brak komentarzy. Bądź pierwszy!</p>
      )}

      {/* Comment Form */}
      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <p className="text-green-800 font-medium">Dziękujemy za komentarz!</p>
          <p className="text-green-600 text-sm mt-1">Twój komentarz pojawi się po moderacji.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Dodaj komentarz</h4>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="comment-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Imię *
              </label>
              <Input
                id="comment-name"
                required
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                placeholder="Jan Kowalski"
                className="bg-white"
              />
            </div>
            <div>
              <label htmlFor="comment-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email (nie będzie widoczny)
              </label>
              <Input
                id="comment-email"
                type="email"
                value={formData.author_email}
                onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                placeholder="jan@example.com"
                className="bg-white"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="comment-content" className="block text-sm font-medium text-gray-700 mb-1.5">
              Komentarz *
            </label>
            <Textarea
              id="comment-content"
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Napisz swój komentarz..."
              className="bg-white resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={createCommentMutation.isPending}
            className="bg-[#e6007e] hover:bg-[#c70069]"
          >
            <Send className="w-4 h-4 mr-2" />
            {createCommentMutation.isPending ? 'Wysyłanie...' : 'Wyślij komentarz'}
          </Button>
        </form>
      )}
    </section>
  );
}