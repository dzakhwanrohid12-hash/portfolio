"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, MailOpen, Trash2, X, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { ContactMessage } from "@/lib/types"
import { cn } from "@/lib/utils"

interface MessagesManagerProps {
  messages: ContactMessage[]
}

export function MessagesManager({ messages }: MessagesManagerProps) {
  const router = useRouter()
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  const handleMarkAsRead = async (message: ContactMessage) => {
    const supabase = createClient()
    await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", message.id)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return

    const supabase = createClient()
    await supabase.from("contact_messages").delete().eq("id", id)
    setSelectedMessage(null)
    router.refresh()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-heading font-bold">Messages</h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-1 text-sm bg-foreground text-background rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
        <p className="text-muted-foreground mt-2">
          View and manage contact form submissions.
        </p>
      </motion.div>

      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
          <p className="text-muted-foreground">
            Messages from your contact form will appear here.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              onClick={() => {
                setSelectedMessage(message)
                if (!message.is_read) {
                  handleMarkAsRead(message)
                }
              }}
              className={cn(
                "flex items-start gap-4 p-4 rounded-2xl border bg-card cursor-pointer transition-all hover:border-foreground/20",
                !message.is_read ? "border-foreground/30" : "border-border"
              )}
            >
              <div className={cn(
                "p-2 rounded-full",
                !message.is_read ? "bg-foreground text-background" : "bg-secondary"
              )}>
                {message.is_read ? (
                  <MailOpen className="w-5 h-5" />
                ) : (
                  <Mail className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className={cn(
                    "font-semibold truncate",
                    !message.is_read && "text-foreground"
                  )}>
                    {message.name}
                  </h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(message.created_at)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                {message.subject && (
                  <p className="text-sm font-medium mt-1">{message.subject}</p>
                )}
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {message.message}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-background rounded-2xl shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-heading font-bold">Message Details</h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">From</label>
                  <p className="font-medium">{selectedMessage.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                </div>

                {selectedMessage.subject && (
                  <div>
                    <label className="text-sm text-muted-foreground">Subject</label>
                    <p className="font-medium">{selectedMessage.subject}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm text-muted-foreground">Message</label>
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Received</label>
                  <p className="text-sm">{formatDate(selectedMessage.created_at)}</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "Your message"}`}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-foreground text-background font-medium text-center hover:bg-foreground/90 transition-colors"
                  >
                    Reply via Email
                  </a>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="px-4 py-2.5 rounded-xl border border-border hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
