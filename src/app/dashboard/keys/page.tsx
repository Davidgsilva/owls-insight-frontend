"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Key, Plus, Copy, Warning, Trash } from "@phosphor-icons/react";
import { useAuth } from "@/hooks/useAuth";

interface APIKey {
  id: string;
  name: string | null;
  tier: "free" | "bench" | "rookie" | "mvp";
  isActive: boolean;
  createdAt: string;
  lastUsedAt: string | null;
}

const tierColors: Record<string, string> = {
  free: "bg-zinc-800/50 text-zinc-500 border-zinc-700/30",
  bench: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  rookie: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  mvp: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function APIKeysPage() {
  const { user, subscription } = useAuth();
  const isVerified = user?.emailVerified ?? false;
  const isFreeTier = !subscription?.tier || subscription.tier === "free";
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [maxKeys, setMaxKeys] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKey, setNewKey] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<APIKey | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchKeys(controller.signal);
    return () => controller.abort();
  }, []);

  async function fetchKeys(signal?: AbortSignal) {
    try {
      const res = await fetch("/api/auth/keys", { credentials: "include", signal });
      const data = await res.json();
      if (data.success) {
        setKeys(data.apiKeys);
        setMaxKeys(data.maxKeys);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      console.error("Failed to fetch keys:", error);
      toast.error("Failed to load API keys");
    } finally {
      setIsLoading(false);
    }
  }

  async function generateKey() {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/auth/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newKeyName || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate key");
      }

      setNewKey(data.apiKey.key);
      setShowGenerateModal(false);
      setShowNewKeyModal(true);
      setNewKeyName("");
      fetchKeys();
      toast.success("API key generated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate key");
    } finally {
      setIsGenerating(false);
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy - try selecting and copying manually");
    }
  }

  async function deleteKey() {
    if (!keyToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/auth/keys/${keyToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete key");
      }

      setShowDeleteModal(false);
      setKeyToDelete(null);
      fetchKeys();
      toast.success("API key deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete key");
    } finally {
      setIsDeleting(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-white">API Keys</h1>
          <p className="text-zinc-400 mt-1">
            Manage your API keys for programmatic access
          </p>
        </div>
        <Button
          onClick={() => setShowGenerateModal(true)}
          disabled={keys.length >= maxKeys || !isVerified || isFreeTier}
          className="bg-[#00FF88] hover:bg-[#00d474] text-[#0a0a0a] font-semibold"
          title={isFreeTier ? "Subscribe to a plan to generate API keys" : !isVerified ? "Verify your email to generate API keys" : undefined}
        >
          <Plus size={16} className="mr-2" />
          Generate New Key
        </Button>
      </div>

      {isFreeTier && (
        <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-200 font-medium">
              Subscription required
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Subscribe to a paid plan to generate API keys and access the API.
            </p>
          </div>
          <Link href="/dashboard/billing">
            <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white font-semibold shrink-0">
              View Plans
            </Button>
          </Link>
        </div>
      )}

      {!isVerified && !isFreeTier && (
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
          <p className="text-sm text-yellow-200">
            Please verify your email before generating API keys.
          </p>
        </div>
      )}

      <Card className="bg-[#111113] border-white/5">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-white flex items-center gap-2">
            <Key size={20} weight="duotone" className="text-[#00FF88]" />
            Your API Keys
          </CardTitle>
          <CardDescription className="text-zinc-500">
            {keys.length} of {maxKeys} keys used
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-8">
              <Key size={48} weight="duotone" className="text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">No API keys yet</p>
              <p className="text-zinc-500 text-sm mt-1">
                Generate your first key to start using the API
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Name</TableHead>
                  <TableHead className="text-zinc-400">Key ID</TableHead>
                  <TableHead className="text-zinc-400">Tier</TableHead>
                  <TableHead className="text-zinc-400">Created</TableHead>
                  <TableHead className="text-zinc-400">Last Used</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key.id} className="border-white/5">
                    <TableCell className="text-white font-medium">
                      {key.name || "Unnamed"}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs text-zinc-400 font-mono">
                        {key.id}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${tierColors[key.tier]} border font-mono text-xs`}>
                        {key.tier.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">
                      {formatDate(key.createdAt)}
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">
                      {key.lastUsedAt ? formatDate(key.lastUsedAt) : "Never"}
                    </TableCell>
                    <TableCell>
                      {key.isActive ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setKeyToDelete(key);
                          setShowDeleteModal(true);
                        }}
                        className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Generate Key Modal */}
      <Dialog open={showGenerateModal} onOpenChange={setShowGenerateModal}>
        <DialogContent className="bg-[#111113] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white font-mono">Generate New API Key</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Create a new API key for programmatic access to the API
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Key Name (optional)</label>
              <Input
                placeholder="e.g., Production, Development"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="bg-[#0a0a0a] border-white/10 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowGenerateModal(false)}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={generateKey}
              disabled={isGenerating}
              className="bg-[#00FF88] hover:bg-[#00d474] text-[#0a0a0a] font-semibold"
            >
              {isGenerating ? "Generating..." : "Generate Key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Key Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-[#111113] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white font-mono flex items-center gap-2">
              <Warning size={20} weight="duotone" className="text-red-400" />
              Delete API Key
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to permanently delete{" "}
              <span className="text-white font-medium">
                {keyToDelete?.name || "this key"}
              </span>
              ? Any applications using this key will immediately lose access. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={deleteKey}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {isDeleting ? "Deleting..." : "Delete Key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Key Display Modal */}
      <Dialog open={showNewKeyModal} onOpenChange={setShowNewKeyModal}>
        <DialogContent className="bg-[#111113] border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white font-mono flex items-center gap-2">
              <Warning size={20} weight="duotone" className="text-yellow-400" />
              Save Your API Key
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              This is the only time you will see this key. Copy it now and store it securely.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between gap-4">
                <code className="text-sm text-[#00FF88] font-mono break-all flex-1">
                  {newKey}
                </code>
                <Button
                  onClick={() => copyToClipboard(newKey)}
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-white hover:bg-white/5 shrink-0"
                >
                  <Copy size={16} className="mr-2" />
                  Copy
                </Button>
              </div>
            </div>
            <p className="text-xs text-yellow-400/80 mt-3 flex items-center gap-1">
              <Warning size={12} weight="bold" />
              You will not be able to see this key again after closing this dialog
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowNewKeyModal(false);
                setNewKey("");
              }}
              className="bg-[#00FF88] hover:bg-[#00d474] text-[#0a0a0a] font-semibold"
            >
              I&apos;ve saved my key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
