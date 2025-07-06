import React, { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Edit2, Check, X } from 'lucide-react';

export function UserProfile() {
  const { user, loading, error, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleEdit = () => {
    setUsername(user?.username || '');
    setIsEditing(true);
    setUpdateError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUsername('');
    setUpdateError(null);
  };

  const handleSave = async () => {
    if (!username.trim()) {
      setUpdateError('Username cannot be empty');
      return;
    }

    try {
      setUpdating(true);
      setUpdateError(null);
      await updateUser({ username: username.trim() });
      setIsEditing(false);
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update username');
    } finally {
      setUpdating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border mb-6">
      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
        <User className="w-5 h-5 text-blue-600" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter username"
                className="flex-1"
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updating || !username.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={updating}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <div>
                <p className="font-medium">{user?.username || 'No username set'}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleEdit}
                className="ml-auto"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
        
        {updateError && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription className="text-xs">{updateError}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}