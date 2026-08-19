import { supabase } from '@/lib/supabase';

export const ChatService = {
    // Fetch available rooms for a user
    async getChatRooms() {
        const { data, error } = await supabase
            .from('chat_rooms')
            .select('*');
        if (error) throw error;
        return data;
    },

    // Fetch paginated messages for a room
    async getMessages(roomId: string, limit = 50) {
        const { data, error } = await supabase
            .from('messages')
            .select('*, sender:sender_id(email, first_name, last_name)')
            .eq('room_id', roomId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data.reverse();
    },

    // Send a new message
    async sendMessage(roomId: string, senderId: string, content: string, fileUrl?: string) {
        const { data, error } = await supabase
            .from('messages')
            .insert({ room_id: roomId, sender_id: senderId, content, file_url: fileUrl })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Subscribe to new realtime messages
    subscribeToMessages(roomId: string, callback: (payload: any) => void) {
        return supabase
            .channel(`room_${roomId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
                callback
            )
            .subscribe((status, err) => {
                if (err) console.warn('Supabase Chat Sync offline: Using mock architecture instead.');
            });
    },

    unsubscribe(channel: any) {
        supabase.removeChannel(channel);
    }
};
