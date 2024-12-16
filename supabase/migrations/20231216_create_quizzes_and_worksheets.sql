-- Create quizzes table
CREATE TABLE quizzes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    lesson_plan_id UUID REFERENCES lesson_plans(id) ON DELETE CASCADE,
    total_points INTEGER NOT NULL,
    duration_minutes INTEGER NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz questions table
CREATE TABLE quiz_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('multiple_choice', 'short_answer', 'true_false')),
    options JSONB,
    correct_answer TEXT NOT NULL,
    points INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create worksheets table
CREATE TABLE worksheets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    lesson_plan_id UUID REFERENCES lesson_plans(id) ON DELETE CASCADE,
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    estimated_time_minutes INTEGER NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create worksheet items table
CREATE TABLE worksheet_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    worksheet_id UUID REFERENCES worksheets(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('exercise', 'problem', 'activity')),
    content TEXT NOT NULL,
    instructions TEXT NOT NULL,
    points INTEGER,
    resources JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student assignments table for both quizzes and worksheets
CREATE TABLE student_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    worksheet_id UUID REFERENCES worksheets(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed')),
    score INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT one_resource_type CHECK (
        (quiz_id IS NOT NULL AND worksheet_id IS NULL) OR
        (worksheet_id IS NOT NULL AND quiz_id IS NULL)
    )
);

-- Create RLS policies
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE worksheet_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_assignments ENABLE ROW LEVEL SECURITY;

-- Policies for teachers (through lesson_plans and classrooms)
CREATE POLICY "Teachers can view their quizzes" ON quizzes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM lesson_plans lp
            JOIN classrooms c ON c.id = lp.classroom_id
            WHERE lp.id = quizzes.lesson_plan_id
            AND c.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can create quizzes" ON quizzes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM lesson_plans lp
            JOIN classrooms c ON c.id = lp.classroom_id
            WHERE lp.id = lesson_plan_id
            AND c.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can update their quizzes" ON quizzes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM lesson_plans lp
            JOIN classrooms c ON c.id = lp.classroom_id
            WHERE lp.id = lesson_plan_id
            AND c.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can delete their quizzes" ON quizzes
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM lesson_plans lp
            JOIN classrooms c ON c.id = lp.classroom_id
            WHERE lp.id = lesson_plan_id
            AND c.teacher_id = auth.uid()
        )
    );

-- Similar policies for worksheets
CREATE POLICY "Teachers can view their worksheets" ON worksheets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM lesson_plans lp
            JOIN classrooms c ON c.id = lp.classroom_id
            WHERE lp.id = worksheets.lesson_plan_id
            AND c.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can create worksheets" ON worksheets
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM lesson_plans lp
            JOIN classrooms c ON c.id = lp.classroom_id
            WHERE lp.id = lesson_plan_id
            AND c.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can update their worksheets" ON worksheets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM lesson_plans lp
            JOIN classrooms c ON c.id = lp.classroom_id
            WHERE lp.id = lesson_plan_id
            AND c.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can delete their worksheets" ON worksheets
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM lesson_plans lp
            JOIN classrooms c ON c.id = lp.classroom_id
            WHERE lp.id = lesson_plan_id
            AND c.teacher_id = auth.uid()
        )
    );

-- Policies for quiz questions and worksheet items (inherited from parent)
CREATE POLICY "Inherited quiz question access" ON quiz_questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM quizzes q
            JOIN lesson_plans lp ON lp.id = q.lesson_plan_id
            JOIN classrooms c ON c.id = lp.classroom_id
            WHERE q.id = quiz_questions.quiz_id
            AND c.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Inherited worksheet item access" ON worksheet_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM worksheets w
            JOIN lesson_plans lp ON lp.id = w.lesson_plan_id
            JOIN classrooms c ON c.id = lp.classroom_id
            WHERE w.id = worksheet_items.worksheet_id
            AND c.teacher_id = auth.uid()
        )
    );

-- Policies for student assignments
CREATE POLICY "Teachers can manage assignments" ON student_assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM students s
            JOIN classrooms c ON c.id = s.classroom_id
            WHERE s.id = student_assignments.student_id
            AND c.teacher_id = auth.uid()
        )
    );
