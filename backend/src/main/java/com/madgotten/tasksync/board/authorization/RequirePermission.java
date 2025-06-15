package com.madgotten.tasksync.board.authorization;

import com.madgotten.tasksync.board.models.Role;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequirePermission {
    Role value();
    boolean allowPublic() default false;
}
