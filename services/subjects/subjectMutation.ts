import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TPostRenewAttempts, TPostSubmitAnswer, TPostSubmitIntegrationAnswer } from "@/types/questions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";


export const useGetSubjects = (pupil_id: string) => {
    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.get(ENDPOINTS.journey.getPupilSubjects.replace(":pupil_id", pupil_id), {
                params: {
                    pupil_id: pupil_id,
                }
            });
            return response.data.data;
        }
    });
};

export const useGetJourneyMapOld = (pupil_id: string) => {
    return useMutation({
        // subject_id is provided when mutate is called
        mutationFn: async (subject_id: string) => {
            // Normalize IDs to strings if they're arrays
            const normalizedPupilId = Array.isArray(pupil_id) ? pupil_id[0] : pupil_id;
            const normalizedSubjectId = Array.isArray(subject_id) ? subject_id[0] : subject_id;
            const response = await axiosInstance.get(ENDPOINTS.journey.getJourneyMapOld.replace(":pupil_id", normalizedPupilId).replace(":subject_id", normalizedSubjectId), {
                params: {
                    pupil_id: normalizedPupilId,
                    subject_id: normalizedSubjectId,
                }
            });
            return response.data.data;
        }
    });
};

// Memoized data transformation functions for journey map
const useJourneyTransformations = () => {
    // Memoize buildHierarchy function
    const buildHierarchy = useCallback((flatNodes: any[]): any[] => {
        // Create a map of all nodes by ID
        const nodeMap: { [key: string]: any } = {};

        // First pass: create node copies with empty children arrays
        flatNodes.forEach(node => {
            nodeMap[node.id] = {
                ...node,
                children: []
            };
        });

        // Second pass: build hierarchy
        const rootNodes: any[] = [];
        flatNodes.forEach(node => {
            const nodeCopy = nodeMap[node.id];

            if (node.parentId) {
                // Add to parent's children
                const parent = nodeMap[node.parentId];
                if (parent) {
                    parent.children.push(nodeCopy);
                } else {
                    // Parent not found, treat as root node
                    rootNodes.push(nodeCopy);
                }
            } else {
                // This is a root node
                rootNodes.push(nodeCopy);
            }
        });

        return rootNodes;
    }, []);

    // Memoize flattenJourneyMap function
    const flattenJourneyMap = useCallback((nodes: any[]): any[] => {
        const flatList: any[] = [];

        const traverse = (nodesToProcess: any[]) => {
            for (const node of nodesToProcess) {
                // Add current node to flat list
                flatList.push(node);

                // Process children recursively if they exist
                if (node.children && node.children.length > 0) {
                    traverse(node.children);
                }
            }
        };

        traverse(nodes);
        return flatList;
    }, []);

    // Memoize countLessonsByLevel function
    const countLessonsByLevel = useCallback((nodes: any[]): { [levelId: string]: number } => {
        const lessonCounts: { [levelId: string]: number } = {};
        const flatList = flattenJourneyMap(nodes);

        // First, identify all levels
        const levels = flatList.filter(node =>
            node.nodeType === 'level' || node.node_type === 'level'
        );

        // Initialize counts for each level
        levels.forEach(level => {
            lessonCounts[level.id] = 0;
        });

        // Count lessons for each level
        flatList.forEach(node => {
            // Check if node is a lesson
            if (node.nodeType === 'level' || node.node_type === 'level') {
                // Find to parent level for this lesson
                const parentLevel = findParentLevel(node, nodes);
                if (parentLevel) {
                    lessonCounts[parentLevel.id]++;
                }
            }
        });

        return lessonCounts;
    }, [flattenJourneyMap]);

    // Memoize findParentLevel function
    const findParentLevel = useCallback((lessonNode: any, nodes: any[]): any => {
        const traverse = (nodesToProcess: any[]): any => {
            for (const node of nodesToProcess) {
                // Check if this node is a level and contains the lesson
                if ((node.nodeType === 'lesson' || node.node_type === 'lesson')) {
                    const flatChildren = flattenJourneyMap(node.children || []);
                    if (flatChildren.some(child => child.id === lessonNode.id)) {
                        return node;
                    }
                }

                // Recursively check children
                if (node.children && node.children.length > 0) {
                    const result = traverse(node.children);
                    if (result) return result;
                }
            }
            return null;
        };

        return traverse(nodes);
    }, [flattenJourneyMap]);

    // Memoize countLevels function
    const countLevels = useCallback((nodes: any[]): number => {
        let count = 0;

        for (const node of nodes) {
            // Handle both nodeType and node_type for compatibility
            if (node.nodeType === "lesson" || node.node_type === "lesson") count++;
            if (node.children?.length) {
                count += countLevels(node.children);
            }
        }

        return count;
    }, []);

    // Memoize getLevels function
    const getLevels = useCallback((nodes: any[]): any[] => {
        const levels = [];

        for (const node of nodes) {
            // Handle both nodeType and node_type for compatibility
            if (node.nodeType === "lesson" || node.node_type === "lesson") {
                levels.push(node);
            }
            if (node.children?.length) {
                levels.push(...getLevels(node.children));
            }
        }

        return levels;
    }, []);

    return {
        buildHierarchy,
        flattenJourneyMap,
        countLessonsByLevel,
        findParentLevel,
        countLevels,
        getLevels
    };
};

// Optimized hook with memoized data transformations
export const useTransformedJourneyMap = (pupil_id: string) => {
    const { mutate: getJourneyMap, isPending, data } = useGetJourneyMapOld(pupil_id);
    const { buildHierarchy } = useJourneyTransformations();

    // Memoize transformed data to avoid recomputation
    const transformedData = useMemo(() => {
        if (!data?.structure) return data;

        // Apply the same transformation logic with memoized function
        return {
            ...data,
            structure: buildHierarchy(data.structure)
        };
    }, [data, buildHierarchy]);

    return { mutate: getJourneyMap, isPending, data: transformedData };
};

export const useGetSubjectProgress = (
    pupil_id: string,
    subject_id: string
) => {
    return useQuery({
        queryKey: ['subjectProgress', pupil_id, subject_id],
        queryFn: async () => {
            const response = await axiosInstance.get(
                ENDPOINTS.journey.getSubjectProgress
                    .replace(":pupil_id", pupil_id)
                    .replace(":subject_id", subject_id)
            );
            return response.data.data;
        },
        enabled: !!pupil_id && !!subject_id, // Only fetch when both IDs are available
    });
};


export const useGetSubjectLessonCardsOld = (pupil_id: string, lesson_id: string) => {
    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.get(ENDPOINTS.journey.getLessonCards.replace(":pupil_id", pupil_id).replace(":lesson_id", lesson_id), {
                params: {
                    pupil_id: pupil_id,
                    lesson_id: lesson_id,
                }
            });
            return response.data.data;
        }
    });
};


export const useCompleteLessonStep = (pupil_id: string, lesson_step_id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.post(ENDPOINTS.journey.completeLessonStep.replace(":pupil_id", pupil_id).replace(":step_id", lesson_step_id), {
                pupil_id: pupil_id,
                step_id: lesson_step_id,
            });
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getPupilModuleData', pupil_id] });
        }
    });
};

export const useGetLessonStepInfoOld = (step_id: string) => {
    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.get(ENDPOINTS.journey.getStepInfo.replace(":step_id", step_id), {
                params: {
                    step_id: step_id,
                }
            });
            return response.data.data;
        }
    });
};

export const useSubmitAnswer = () => {
    return useMutation({
        mutationFn: async (data: TPostSubmitAnswer) => {
            const response = await axiosInstance.post(ENDPOINTS.journey.submitAnswer(data.params.pupilId, data.params.questionId), {
                ...data.data
            })
            return response.data.data;
        }
    });
};


export const useSubmitIntegrationAnswer = () => {
    return useMutation({
        mutationFn: async (data: TPostSubmitIntegrationAnswer) => {
            const response = await axiosInstance.post(ENDPOINTS.journey.submitIntegrations(data.params.pupilId, data.params.lessonId, data.params.questionId), {
                ...data.data
            })
            return response.data.data;
        }
    });
};


export const useRenewAttempts = () => {
    return useMutation({
        mutationFn: async (data: TPostRenewAttempts) => {
            const response = await axiosInstance.post(ENDPOINTS.journey.renewAttempts(data.pupilId, data.lessonId))
            return response.data.data;
        }
    });
};