"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { replySchema } from "@/ValidationSchemas/reply";
import { zodResolver } from "@hookform/resolvers/zod";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Button } from "./ui/button";
import { getSession } from "next-auth/react";
import axios from "axios";

type ReplyFormData = z.infer<typeof replySchema>;

interface Props {
  ticketId: number;
  reply?: ReplyFormData;
  onReplySubmitted: () => void;
}

const ReplyForm = ({ ticketId, reply, onReplySubmitted }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

  const form = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
    defaultValues: reply ? { content: reply.content } : {},
  });

  useEffect(() => {
    async function fetchSession() {
      const session = await getSession();
      if (session && session.user) {
        setUserName(session.user.name || "");
      }
    }
    fetchSession();
  }, []);

  async function onSubmit(values: ReplyFormData) {
    try {
      setIsSubmitting(true);
      setError("");

      const data = {
        ...values,
        ticketId,
      };

      await axios.post(`/api/tickets/${ticketId}/replies`, data);

      setIsSubmitting(false);
      onReplySubmitted();
      form.reset();
    } catch (error) {
      console.log(error);
      setError("Unknown Error Occurred.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-md border w-full p-4 my-0">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <Controller
          name="content"
          control={form.control}
          render={({ field }) => (
            <SimpleMDE placeholder="Write your reply..." {...field} />
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          Submit Reply
        </Button>
      </form>
      <p className="text-destructive">{error}</p>
    </div>
  );
};

export default ReplyForm;
