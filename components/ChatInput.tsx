"use client"

import React from "react";
import { Input } from "./ui/input";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "@/lib/store/user";
import { IMessage, useMessage } from "@/lib/store/messages";

export default function ChatInput() {
  const user = useUser((state) => state.user);
  const supabase = supabaseBrowser();
  const addMessage = useMessage((state) => state.optimisticAddMessage);

  const handleSendMessage = async (text: string) => {
    if (text.trim()) {
      const {error, data} = await supabase.from("messages").insert({ text }).select();
  
      if (error) {
        toast.error(error.message);
      } else {
        addMessage({
          ...data[0],
          users: {
            id: user?.id!,
            avatar_url: user?.user_metadata.avatar_url,
            created_at: new Date().toISOString(),
            display_name: user?.user_metadata.user_name
          }
        });
      }
    } else {
      toast.error("Message can not be empty!!");
    }
  }

  return (
    <div className="p-5">
      <Input placeholder="Send message" onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSendMessage(e.currentTarget.value);
          e.currentTarget.value = "";
        }
      }}/>
    </div>
  )
}