import React, { useState } from 'react';
import { polbelApi} from '@/api/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Trash2, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CommentsManager({ comments, posts }) {
  const [filter, setFilter] = useState('pending');
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => polbelApi.entities.BlogComment.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      toast.success('Komentarz został zaktualizowany');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => polbelApi.entities.BlogComment.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      toast.success('Komentarz został usunięty');
      setDeleteCommentId(null);
    }
  });

  const handleApprove = (comment) => {
    updateMutation.mutate({ id: comment.id, data: { ...comment, approved: true } });
  };

  const handleReject = (comment) => {
    updateMutation.mutate({ id: comment.id, data: { ...comment, approved: false } });
  };

  const getPostTitle = (postId) => {
    const post = posts.find(p => p.id === postId);
    return post?.title || 'Nieznany artykuł';
  };

  const filteredComments = comments.filter(c => {
    if (filter === 'pending') return !c.approved;
    if (filter === 'approved') return c.approved;
    return true;
  });

  const pendingCount = comments.filter(c => !c.approved).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Komentarze</h1>
          {pendingCount > 0 && (
            <p className="text-sm text-orange-600 mt-1">
              {pendingCount} komentarzy oczekuje na moderację
            </p>
          )}
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie</SelectItem>
            <SelectItem value="pending">Oczekujące</SelectItem>
            <SelectItem value="approved">Zatwierdzone</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredComments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Brak komentarzy do wyświetlenia</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map(comment => (
            <div 
              key={comment.id} 
              className={`bg-white rounded-xl border p-6 ${
                !comment.approved ? 'border-orange-200 bg-orange-50/50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">{comment.author_name}</span>
                    {comment.author_email && (
                      <span className="text-sm text-gray-500">{comment.author_email}</span>
                    )}
                    <Badge className={comment.approved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                      {comment.approved ? 'Zatwierdzony' : 'Oczekuje'}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      {format(new Date(comment.created_date), 'd MMMM yyyy, HH:mm', { locale: pl })}
                    </span>
                    <span className="truncate max-w-xs">
                      Do: {getPostTitle(comment.post_id)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!comment.approved && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleApprove(comment)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Zatwierdź
                    </Button>
                  )}
                  {comment.approved && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      onClick={() => handleReject(comment)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Odrzuć
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setDeleteCommentId(comment.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteCommentId} onOpenChange={() => setDeleteCommentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuń komentarz</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć ten komentarz? Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteMutation.mutate(deleteCommentId)}
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}