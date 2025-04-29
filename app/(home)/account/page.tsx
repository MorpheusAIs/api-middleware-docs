'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { authenticatedJsonFetch } from '@/lib/api';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Helper function to mask the API key
const maskApiKey = (key: string | null): string => {
  if (!key) return ''
  if (key.length <= 11) return key; // Return as is if too short to mask meaningfully (e.g., sk- + 8 chars)
  // Show prefix (e.g., sk-) + first 4 after prefix + ... + last 4
  const prefix = key.startsWith('sk-') ? 'sk-' : '';
  const mainPart = key.substring(prefix.length);
  if (mainPart.length <= 8) return key; // Still too short after prefix

  return `${prefix}${mainPart.substring(0, 4)}...${mainPart.substring(mainPart.length - 4)}`;
};

interface APIKey {
  id: number;
  key_prefix: string;
  name: string | null;
  created_at: string;
  is_active: boolean;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingKeys, setIsLoadingKeys] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<number | null>(null);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null);
  const [isNameDuplicate, setIsNameDuplicate] = useState(false);

  const fetchApiKeys = async () => {
    setIsLoadingKeys(true);
    setError(null);
    try {
      console.log("Attempting to fetch API keys...");
      const keys = await authenticatedJsonFetch<APIKey[]>('/api/auth/keys');
      console.log("API keys fetched successfully:", keys);
      setApiKeys(keys);
    } catch (error: any) {
      console.error('Failed to fetch API keys:', error);
      setError(error.message || 'Failed to load API keys');
      toast.error(error.message || 'Failed to load API keys');
    } finally {
      setIsLoadingKeys(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      console.log("Session status is authenticated, fetching keys.");
      fetchApiKeys();
    } else if (status === 'unauthenticated') {
       console.log("Session status is unauthenticated.");
       setIsLoadingKeys(false);
       setApiKeys([]);
    } else {
       console.log("Session status is loading...");
       setIsLoadingKeys(true);
    }
  }, [status]);

  const handleGenerateKey = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      const response = await authenticatedJsonFetch<{
        key: string;
        key_prefix: string;
        name: string | null;
      }>('/api/auth/keys', {
        method: 'POST',
        body: JSON.stringify({
          name: newKeyName || null,
        }),
      });

      console.log("API Key Generation Response Received:", response);
      console.log("Value of response.key:", response?.key);

      setNewlyGeneratedKey(response.key);
      setNewKeyName('');
      await fetchApiKeys();
    } catch (error: any) {
      console.error('Failed to generate API key:', error);
      setError(error.message || 'Failed to generate API key');
      toast.error(error.message || 'Failed to generate API key');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNewKeyName(name);
    if (name && apiKeys.some(key => key.name === name)) {
      setIsNameDuplicate(true);
    } else {
      setIsNameDuplicate(false);
    }
  };

  const performDeleteKey = async () => {
    if (keyToDelete === null) return;

    setIsDeleting(true);
    setError(null);
    try {
      await authenticatedJsonFetch(`/api/auth/keys/${keyToDelete}`, {
        method: 'DELETE',
      });
      toast.success('API key deleted');
      setKeyToDelete(null);
      await fetchApiKeys();
    } catch (error: any) {
      console.error('Failed to delete API key:', error);
      setError(error.message || 'Failed to delete API key');
      toast.error(error.message || 'Failed to delete API key');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (keyId: number) => {
    setKeyToDelete(keyId);
  };

  const copyToClipboard = async (text: string, isMasked: boolean = false) => {
    // If it's masked in the UI, we still copy the *full* key
    // The full key is only available in newlyGeneratedKey state
    const textToCopy = (isMasked && text === maskApiKey(newlyGeneratedKey)) ? newlyGeneratedKey : text;
    if (textToCopy) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        toast('Copied to clipboard', {
          description: 'The API key has been copied to your clipboard.',
          action: {
            label: 'Dismiss',
            onClick: () => console.log('Dismissed')
          },
        });
      } catch (error) {
        toast.error('Failed to copy', {
          description: 'Could not copy the API key to clipboard.',
        });
      }
    } else {
      toast.error('Could not copy key', {
        description: 'The API key is not available.',
      });
    }
  };

  if (status === 'loading') {
    return <div className="container max-w-4xl mx-auto py-12 text-center">Loading session...</div>;
  }

  if (status === 'unauthenticated') {
    return <div className="container max-w-4xl mx-auto py-12 text-center">Please log in to manage your account.</div>;
  }

  return (
    <>
      <div className="container max-w-4xl mx-auto py-12">
        <div className="flex flex-col gap-8">
          {session?.user?.email && (
            <p className="text-center text-muted-foreground">Logged in as: {session.user.email}</p>
          )}

          <div className="flex justify-center my-4">
            <appkit-button />
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Generate New API Key</CardTitle>
              <CardDescription>
                Create a new API key for accessing the Morpheus API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="keyName">Key Name (Optional)</Label>
                  <Input
                    id="keyName"
                    placeholder="My API Key"
                    value={newKeyName}
                    onChange={handleNameChange}
                    disabled={isGenerating}
                    className={isNameDuplicate ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {isNameDuplicate && (
                    <p className="text-sm text-red-600">API key name already exists.</p>
                  )}
                </div>
                <Button
                  onClick={handleGenerateKey}
                  disabled={isGenerating || isNameDuplicate}
                >
                  {isGenerating ? 'Generating...' : 'Generate New API Key'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                Manage your existing API keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingKeys ? (
                <div className="text-center py-4">Loading API keys...</div>
              ) : apiKeys.length === 0 && !error ? (
                <div className="text-center py-4">No API keys found</div>
              ) : !error ? (
                <div className="max-h-[275px] overflow-y-auto border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Key Prefix</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiKeys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell>{key.name || '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <code>{key.key_prefix}</code>
                              <Button
                                color="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(key.key_prefix)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(key.created_at), 'PPp')}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              key.is_active
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                            }`}>
                              {key.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              color="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(key.id)}
                              disabled={!key.is_active || isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!newlyGeneratedKey} onOpenChange={(isOpen) => { if (!isOpen) setNewlyGeneratedKey(null); }}>
        <DialogContent className="bg-black border rounded-lg shadow-lg sm:max-w-md">
          <DialogHeader>
            <DialogTitle>API Key Generated</DialogTitle>
            <DialogDescription>
              This is the only time you will see this key. Copy it now and store it securely.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <code className="flex-1 p-2 bg-muted rounded-md text-sm break-all">
              {maskApiKey(newlyGeneratedKey)}
            </code>
            <Button
                color="secondary"
                size="icon-sm"
                onClick={() => {
                    copyToClipboard(maskApiKey(newlyGeneratedKey), true);
                }}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy</span>
              </Button>
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" color="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!keyToDelete} onOpenChange={() => setKeyToDelete(null)}>
        <AlertDialogPortal>
          <AlertDialogOverlay className="bg-black/50" />
          <AlertDialogContent className="bg-black border rounded-lg shadow-lg fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg p-6">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the API key
                (<code className="text-sm bg-muted p-1 rounded">{apiKeys.find(k => k.id === keyToDelete)?.key_prefix}</code>...)
                and revoke its access.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={performDeleteKey} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete Key'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </>
  );
} 