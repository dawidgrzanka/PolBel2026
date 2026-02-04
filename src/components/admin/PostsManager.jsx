import React, { useState } from 'react';
import { polbelApi} from '@/api/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Pencil, Trash2, Eye, Search, X, Save, ArrowLeft, ImagePlus
} from 'lucide-react';
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

const categoryLabels = {
  poradniki: 'Poradniki',
  realizacje: 'Realizacje',
  nowosci: 'Nowości',
  technologie: 'Technologie',
  branza: 'Branża'
};

const emptyPost = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  category: 'nowosci',
  tags: [],
  author_name: '',
  published: false,
  publish_date: new Date().toISOString().split('T')[0],
  read_time: 5
};

export default function PostsManager({ posts, initialAction }) {
  const [view, setView] = useState(initialAction === 'new' ? 'editor' : 'list');
  const [editingPost, setEditingPost] = useState(initialAction === 'new' ? emptyPost : null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [deletePostId, setDeletePostId] = useState(null);
  const [tagInput, setTagInput] = useState('');
  
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => polbelApi.entities.BlogPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast.success('Artykuł został utworzony');
      setView('list');
      setEditingPost(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => polbelApi.entities.BlogPost.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast.success('Artykuł został zaktualizowany');
      setView('list');
      setEditingPost(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => polbelApi.entities.BlogPost.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast.success('Artykuł został usunięty');
      setDeletePostId(null);
    }
  });

  const handleSave = () => {
    if (!editingPost.title || !editingPost.content) {
      toast.error('Wypełnij tytuł i treść artykułu');
      return;
    }
    
    const slug = editingPost.slug || editingPost.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const postData = { ...editingPost, slug };

    if (editingPost.id) {
      updateMutation.mutate({ id: editingPost.id, data: postData });
    } else {
      createMutation.mutate(postData);
    }
  };

  const handleAddTag = () => {
    if (tagInput && !editingPost.tags?.includes(tagInput)) {
      setEditingPost({
        ...editingPost,
        tags: [...(editingPost.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setEditingPost({
      ...editingPost,
      tags: editingPost.tags.filter(t => t !== tag)
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (view === 'editor') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => { setView('list'); setEditingPost(null); }}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Wróć do listy
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={editingPost?.published}
                onCheckedChange={(checked) => setEditingPost({ ...editingPost, published: checked })}
              />
              <span className="text-sm text-gray-600">
                {editingPost?.published ? 'Opublikowany' : 'Szkic'}
              </span>
            </div>
            <Button 
              onClick={handleSave} 
              className="bg-[#e6007e] hover:bg-[#c70069]"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {createMutation.isPending || updateMutation.isPending ? 'Zapisywanie...' : 'Zapisz'}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            <Input
              placeholder="Tytuł artykułu"
              value={editingPost?.title || ''}
              onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
              className="text-xl font-bold h-14"
            />
            <Input
              placeholder="Krótki opis (SEO - max 160 znaków)"
              value={editingPost?.excerpt || ''}
              onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
              maxLength={160}
            />
            <Textarea
              placeholder="Treść artykułu (Markdown)"
              value={editingPost?.content || ''}
              onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
              className="min-h-[400px] font-mono text-sm"
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Ustawienia</h3>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Slug URL</label>
                <Input
                  placeholder="url-artykulu"
                  value={editingPost?.slug || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Kategoria</label>
                <Select
                  value={editingPost?.category}
                  onValueChange={(value) => setEditingPost({ ...editingPost, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Data publikacji</label>
                <Input
                  type="date"
                  value={editingPost?.publish_date || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, publish_date: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Autor</label>
                <Input
                  placeholder="Imię i nazwisko"
                  value={editingPost?.author_name || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, author_name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Czas czytania (min)</label>
                <Input
                  type="number"
                  min="1"
                  value={editingPost?.read_time || 5}
                  onChange={(e) => setEditingPost({ ...editingPost, read_time: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Obraz główny</h3>
              <Input
                placeholder="URL obrazu"
                value={editingPost?.cover_image || ''}
                onChange={(e) => setEditingPost({ ...editingPost, cover_image: e.target.value })}
              />
              {editingPost?.cover_image && (
                <img 
                  src={editingPost.cover_image} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Tagi</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Dodaj tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button variant="outline" onClick={handleAddTag}>+</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(editingPost?.tags) && editingPost.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)}
                    />
                    </Badge>
                ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Artykuły</h1>
        <Button 
          className="bg-[#e6007e] hover:bg-[#c70069]"
          onClick={() => { setEditingPost(emptyPost); setView('editor'); }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nowy artykuł
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Szukaj artykułów..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Kategoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie</SelectItem>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Tytuł</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden md:table-cell">Kategoria</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden lg:table-cell">Data</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPosts.map(post => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900 truncate max-w-xs">{post.title}</p>
                  <p className="text-sm text-gray-500">{post.views || 0} wyświetleń</p>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <Badge variant="secondary">{categoryLabels[post.category]}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                  {post.publish_date && format(new Date(post.publish_date), 'd MMM yyyy', { locale: pl })}
                </td>
                <td className="px-6 py-4">
                  <Badge className={post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                    {post.published ? 'Opublikowany' : 'Szkic'}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => window.open(`/BlogPost?slug=${post.slug}`, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => { setEditingPost(post); setView('editor'); }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setDeletePostId(post.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPosts.length === 0 && (
          <p className="text-center py-8 text-gray-500">Brak artykułów</p>
        )}
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuń artykuł</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć ten artykuł? Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteMutation.mutate(deletePostId)}
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}