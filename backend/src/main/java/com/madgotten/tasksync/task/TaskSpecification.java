package com.madgotten.tasksync.task;
import com.madgotten.tasksync.task.models.Task;
import org.springframework.data.jpa.domain.Specification;

public class TaskSpecification {
    public static Specification<Task> filterByArchived(String archived) {
        return (root, query, criteriaBuilder) -> {

            if (archived == null) {
                // Default shows only non-archived tasks
                return criteriaBuilder.equal(root.get("archived"), false);
            }

            if (archived.equalsIgnoreCase("all")) {
                // Show all tasks regardless of archived status
                return criteriaBuilder.conjunction();
            }

            // Check the archived parameter and filter
            boolean isArchived = Boolean.parseBoolean(archived);
            return criteriaBuilder.equal(root.get("archived"), isArchived);
        };
    }
}
