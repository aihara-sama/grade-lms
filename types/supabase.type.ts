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
      announcements: {
        Row: {
          created_at: string;
          id: string;
          lesson_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          lesson_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          lesson_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
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
      chat_files: {
        Row: {
          created_at: string;
          ext: string;
          id: string;
          message_id: string;
          name: string;
          path: string;
          size: number;
        };
        Insert: {
          created_at?: string;
          ext: string;
          id?: string;
          message_id: string;
          name: string;
          path: string;
          size: number;
        };
        Update: {
          created_at?: string;
          ext?: string;
          id?: string;
          message_id?: string;
          name?: string;
          path?: string;
          size?: number;
        };
        Relationships: [
          {
            foreignKeyName: "chat_files_message_id_fkey";
            columns: ["message_id"];
            isOneToOne: false;
            referencedRelation: "chat_messages";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_messages: {
        Row: {
          created_at: string;
          creator_id: string;
          id: string;
          lesson_id: string;
          reply_id: string | null;
          text: string | null;
        };
        Insert: {
          created_at?: string;
          creator_id?: string;
          id?: string;
          lesson_id: string;
          reply_id?: string | null;
          text?: string | null;
        };
        Update: {
          created_at?: string;
          creator_id?: string;
          id?: string;
          lesson_id?: string;
          reply_id?: string | null;
          text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
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
          creator_id: string;
          id: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          creator_id?: string;
          id?: string;
          title: string;
        };
        Update: {
          created_at?: string;
          creator_id?: string;
          id?: string;
          title?: string;
        };
        Relationships: [];
      };
      fcm_tokens: {
        Row: {
          created_at: string;
          fcm_token: string;
          id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          fcm_token: string;
          id?: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          fcm_token?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fcm_tokens_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      grades: {
        Row: {
          created_at: string;
          creator_id: string;
          id: string;
          submissions_id: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          creator_id?: string;
          id?: string;
          submissions_id: string;
          title: string;
        };
        Update: {
          created_at?: string;
          creator_id?: string;
          id?: string;
          submissions_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "grades_submissions_id_fkey";
            columns: ["submissions_id"];
            isOneToOne: false;
            referencedRelation: "submissions";
            referencedColumns: ["id"];
          },
        ];
      };
      lessons: {
        Row: {
          course_id: string | null;
          created_at: string;
          creator_id: string;
          ends: string;
          id: string;
          starts: string;
          title: string;
          whiteboard_data: string;
        };
        Insert: {
          course_id?: string | null;
          created_at?: string;
          creator_id?: string;
          ends: string;
          id?: string;
          starts: string;
          title?: string;
          whiteboard_data?: string;
        };
        Update: {
          course_id?: string | null;
          created_at?: string;
          creator_id?: string;
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
          {
            foreignKeyName: "lessons_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "users";
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
          recipient_id: string;
          submission_id: string | null;
          type: Database["public"]["Enums"]["notification_type"];
          user_id: string | null;
        };
        Insert: {
          assignment_id?: string | null;
          course_id?: string | null;
          created_at?: string;
          id?: string;
          is_read: boolean;
          lesson_id?: string | null;
          recipient_id: string;
          submission_id?: string | null;
          type: Database["public"]["Enums"]["notification_type"];
          user_id?: string | null;
        };
        Update: {
          assignment_id?: string | null;
          course_id?: string | null;
          created_at?: string;
          id?: string;
          is_read?: boolean;
          lesson_id?: string | null;
          recipient_id?: string;
          submission_id?: string | null;
          type?: Database["public"]["Enums"]["notification_type"];
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
      submissions: {
        Row: {
          assignment_id: string;
          body: string;
          created_at: string;
          id: string;
          title: string;
          user_id: string;
        };
        Insert: {
          assignment_id: string;
          body: string;
          created_at?: string;
          id?: string;
          title: string;
          user_id?: string;
        };
        Update: {
          assignment_id?: string;
          body?: string;
          created_at?: string;
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
      subscriptions: {
        Row: {
          created_at: string;
          end_date: string | null;
          id: string;
          paypal_subscription_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          end_date?: string | null;
          id?: string;
          paypal_subscription_id: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          end_date?: string | null;
          id?: string;
          paypal_subscription_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey";
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
      user_settings: {
        Row: {
          created_at: string;
          id: string;
          is_emails_on: boolean;
          role: Database["public"]["Enums"]["role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_emails_on: boolean;
          role: Database["public"]["Enums"]["role"];
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_emails_on?: boolean;
          role?: Database["public"]["Enums"]["role"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
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
          id: string;
          name: string;
          preferred_locale: string;
          push_notifications_state: Database["public"]["Enums"]["push_notifications_state"];
          timezone: string;
        };
        Insert: {
          avatar: string;
          created_at?: string;
          creator_id?: string | null;
          email: string;
          id: string;
          name: string;
          preferred_locale: string;
          push_notifications_state?: Database["public"]["Enums"]["push_notifications_state"];
          timezone: string;
        };
        Update: {
          avatar?: string;
          created_at?: string;
          creator_id?: string | null;
          email?: string;
          id?: string;
          name?: string;
          preferred_locale?: string;
          push_notifications_state?: Database["public"]["Enums"]["push_notifications_state"];
          timezone?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_create_course: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      delete_assignments_by_ids: {
        Args: {
          p_assignments_ids: string[];
        };
        Returns: undefined;
      };
      delete_auth_users_by_ids: {
        Args: {
          user_ids: string[];
        };
        Returns: undefined;
      };
      delete_courses_by_ids: {
        Args: {
          p_courses_ids: string[];
        };
        Returns: undefined;
      };
      delete_lessons_by_ids: {
        Args: {
          p_lessons_ids: string[];
        };
        Returns: undefined;
      };
      delete_submissions_by_ids: {
        Args: {
          p_submissions_ids: string[];
        };
        Returns: undefined;
      };
      enroll_all_users_in_all_courses: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      enroll_all_users_in_courses: {
        Args: {
          p_courses_ids: string[];
        };
        Returns: undefined;
      };
      enroll_users_in_all_courses: {
        Args: {
          users_ids: string[];
        };
        Returns: undefined;
      };
      expel_all_users_from_course: {
        Args: {
          p_course_id: string;
          p_user_name: string;
        };
        Returns: undefined;
      };
      expel_users_from_course: {
        Args: {
          p_course_id: string;
          p_users_ids: string[];
        };
        Returns: undefined;
      };
      get_overlapping_lesson: {
        Args: {
          p_starts: string;
          p_ends: string;
          p_lesson_id?: string;
        };
        Returns: {
          course_id: string | null;
          created_at: string;
          creator_id: string;
          ends: string;
          id: string;
          starts: string;
          title: string;
          whiteboard_data: string;
        }[];
      };
      get_upcoming_lessons_users: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          email: string;
          fcm_token: string;
          lesson_id: string;
          is_emails_on: boolean;
          push_notifications_state: Database["public"]["Enums"]["push_notifications_state"];
        }[];
      };
      is_in_course: {
        Args: {
          p_course_id: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
      is_pro: {
        Args: {
          user_uuids: string[];
        };
        Returns: boolean;
      };
    };
    Enums: {
      notification_type: "enrollment" | "submission" | "assignment";
      push_notifications_state: "idle" | "on" | "off";
      role: "teacher" | "student" | "guest";
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
