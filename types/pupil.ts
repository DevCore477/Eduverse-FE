export type TPupil = {
    id: string
    parentId: string
    firstName: string
    lastName: string
    age: number
    gender?: string
    avatarUrl?: string
    pinCode?: string
    currentYearId: string
    createdAt: string
}

export type TPupilCreate = Omit<TPupil, "id" | "createdAt" | "pinCode"> & {
    token?: string
}

export type TPupilUpdate = Partial<TPupilCreate> & {
    id: string
    
}

export type ProgressStats = {
    earned: number
    total: number
    percent?: number
}

export type SubjectProgress = {
    subjectId: string
    name: string
    code: string
    completedLessons: number
    totalLessons: number
    percent: number
    stars: ProgressStats
    badges: ProgressStats
    points: ProgressStats
}

export type RecentActivity = {
    firstName:string,
    subjectName:string
    levelOrderIndex:number
}

export type TPupilData = {
    pupilId: string
    firstName: string
    lastName: string
    levels: {
        completed: number
        total: number
        percent?: number
    }
    stars: ProgressStats
    badges: ProgressStats
    points: {
        earned: number
        total?: number
    }
    subjects: SubjectProgress[]
    nextRecommendedSubject?: {
        name: string
    }
    recentActivities: RecentActivity[]
}

export type TPupilModulesData = Omit<TPupilData, "pupilId">