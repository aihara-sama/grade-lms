export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      assignments: {
        Row: {
          body: string;
          created_at: string;
          due_date: string;
          id: string;
          lesson_id: string;
          title: string;
        };
        Insert: {
          body?: string;
          created_at?: string;
          due_date: string;
          id?: string;
          lesson_id: string;
          title: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          due_date?: string;
          id?: string;
          lesson_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assignments_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_messages: {
        Row: {
          author: string;
          author_avatar: string;
          author_role: Database["public"]["Enums"]["role"];
          id: string;
          lesson_id: string;
          reply_id: string | null;
          text: string | null;
        };
        Insert: {
          author: string;
          author_avatar: string;
          author_role: Database["public"]["Enums"]["role"];
          id?: string;
          lesson_id: string;
          reply_id?: string | null;
          text?: string | null;
        };
        Update: {
          author?: string;
          author_avatar?: string;
          author_role?: Database["public"]["Enums"]["role"];
          id?: string;
          lesson_id?: string;
          reply_id?: string | null;
          text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_messages_reply_id_fkey";
            columns: ["reply_id"];
            isOneToOne: false;
            referencedRelation: "chat_messages";
            referencedColumns: ["id"];
          },
        ];
      };
      courses: {
        Row: {
          created_at: string;
          id: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          title: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          title?: string;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          course_id: string | null;
          created_at: string;
          ends: string;
          id: string;
          starts: string;
          title: string;
          whiteboard_data: string;
        };
        Insert: {
          course_id?: string | null;
          created_at?: string;
          ends: string;
          id?: string;
          starts: string;
          title?: string;
          whiteboard_data?: string;
        };
        Update: {
          course_id?: string | null;
          created_at?: string;
          ends?: string;
          id?: string;
          starts?: string;
          title?: string;
          whiteboard_data?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          assignment_id: string | null;
          course_id: string | null;
          created_at: string;
          id: string;
          is_read: boolean;
          lesson_id: string | null;
          submission_id: string | null;
          type: string;
          user_id: string | null;
        };
        Insert: {
          assignment_id?: string | null;
          course_id?: string | null;
          created_at?: string;
          id?: string;
          is_read: boolean;
          lesson_id?: string | null;
          submission_id?: string | null;
          type: string;
          user_id?: string | null;
        };
        Update: {
          assignment_id?: string | null;
          course_id?: string | null;
          created_at?: string;
          id?: string;
          is_read?: boolean;
          lesson_id?: string | null;
          submission_id?: string | null;
          type?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_assignment_id_fkey";
            columns: ["assignment_id"];
            isOneToOne: false;
            referencedRelation: "assignments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_submission_id_fkey";
            columns: ["submission_id"];
            isOneToOne: false;
            referencedRelation: "submissions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      sent_notifications: {
        Row: {
          id: string;
          lesson_id: string | null;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          lesson_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          lesson_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sent_notifications_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sent_notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      submissions: {
        Row: {
          assignment_id: string;
          body: string;
          created_at: string;
          grade: number | null;
          id: string;
          title: string;
          user_id: string;
        };
        Insert: {
          assignment_id: string;
          body: string;
          created_at?: string;
          grade?: number | null;
          id?: string;
          title: string;
          user_id: string;
        };
        Update: {
          assignment_id?: string;
          body?: string;
          created_at?: string;
          grade?: number | null;
          id?: string;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_id_fkey";
            columns: ["assignment_id"];
            isOneToOne: false;
            referencedRelation: "assignments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "submissions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_courses: {
        Row: {
          course_id: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          user_id: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_courses_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_courses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          avatar: string;
          created_at: string;
          creator_id: string | null;
          email: string;
          fcm_token: string | null;
          id: string;
          name: string;
          preferred_locale: string;
          role: Database["public"]["Enums"]["role"];
        };
        Insert: {
          avatar: string;
          created_at?: string;
          creator_id?: string | null;
          email: string;
          fcm_token?: string | null;
          id: string;
          name: string;
          preferred_locale: string;
          role: Database["public"]["Enums"]["role"];
        };
        Update: {
          avatar?: string;
          created_at?: string;
          creator_id?: string | null;
          email?: string;
          fcm_token?: string | null;
          id?: string;
          name?: string;
          preferred_locale?: string;
          role?: Database["public"]["Enums"]["role"];
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_lesson_with_assignments: {
        Args: {
          new_course_id: string;
          new_title: string;
          new_starts: string;
          new_ends: string;
          new_assignments: Json;
        };
        Returns: string;
      };
      delete_auth_users_by_ids: {
        Args: {
          user_ids: string[];
        };
        Returns: undefined;
      };
      delete_courses_by_title_and_user_id: {
        Args: {
          p_user_id: string;
          p_title: string;
        };
        Returns: undefined;
      };
      get_courses_not_assigned_to_user: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          created_at: string;
          id: string;
          title: string;
        }[];
      };
      get_users_not_in_course: {
        Args: {
          p_course_id: string;
        };
        Returns: {
          avatar: string;
          created_at: string;
          creator_id: string | null;
          email: string;
          fcm_token: string | null;
          id: string;
          name: string;
          preferred_locale: string;
          role: Database["public"]["Enums"]["role"];
        }[];
      };
    };
    Enums: {
      role: "Teacher" | "Student" | "Guest";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
