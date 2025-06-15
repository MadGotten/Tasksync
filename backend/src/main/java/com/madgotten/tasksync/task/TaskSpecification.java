package com.madgotten.tasksync.task;
import com.madgotten.tasksync.task.models.Task;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class TaskSpecification {
    public static Specification<Task> filterByArchived(String archived) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (archived != null) {
                if (archived.equalsIgnoreCase("all")) {
                    predicates.add(criteriaBuilder.isNotNull(root.get("archived")));
                } else {
                    predicates.add(criteriaBuilder.equal(root.get("archived"), Boolean.parseBoolean(archived)));
                }
            }

            if (archived == null) {
                predicates.add(criteriaBuilder.equal(root.get("archived"), false));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
