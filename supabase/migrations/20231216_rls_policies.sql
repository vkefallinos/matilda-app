-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Classrooms policies
CREATE POLICY "Teachers can view their own classrooms"
    ON classrooms FOR SELECT
    USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create classrooms"
    ON classrooms FOR INSERT
    WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own classrooms"
    ON classrooms FOR UPDATE
    USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own classrooms"
    ON classrooms FOR DELETE
    USING (auth.uid() = teacher_id);

-- Students policies
CREATE POLICY "Teachers can view students in their classrooms"
    ON students FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = students.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can create students in their classrooms"
    ON students FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can update students in their classrooms"
    ON students FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = students.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can delete students in their classrooms"
    ON students FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = students.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

-- Lesson plans policies
CREATE POLICY "Teachers can view their lesson plans"
    ON lesson_plans FOR SELECT
    USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create lesson plans"
    ON lesson_plans FOR INSERT
    WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their lesson plans"
    ON lesson_plans FOR UPDATE
    USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their lesson plans"
    ON lesson_plans FOR DELETE
    USING (auth.uid() = teacher_id);

-- Teacher preferences policies
CREATE POLICY "Teachers can view their preferences"
    ON teacher_preferences FOR SELECT
    USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create their preferences"
    ON teacher_preferences FOR INSERT
    WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their preferences"
    ON teacher_preferences FOR UPDATE
    USING (auth.uid() = teacher_id);

-- Classroom settings policies
CREATE POLICY "Teachers can view settings for their classrooms"
    ON classroom_settings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = classroom_settings.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can create settings for their classrooms"
    ON classroom_settings FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can update settings for their classrooms"
    ON classroom_settings FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = classroom_settings.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );
