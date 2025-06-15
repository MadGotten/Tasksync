package com.madgotten.tasksync.board.authorization;

import com.madgotten.tasksync.board.service.BoardService;
import lombok.AllArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@AllArgsConstructor
public class PermissionAspect {

    private BoardService boardService;
    private PermissionService permissionService;

    @Around("@annotation(requirePermission)")
    public Object checkPermission(ProceedingJoinPoint joinPoint, RequirePermission requirePermission) throws Throwable {
        Object[] args = joinPoint.getArgs();

        Integer boardId = (Integer) args[0];
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        if (userId.isEmpty() || boardId == null) {
            throw new SecurityException("Unable to extract user ID or board ID from method arguments");
        }

        if(requirePermission.allowPublic()) {
            boolean isPublic = boardService.isBoardPublic(boardId);
            if(isPublic) {
                return joinPoint.proceed();
            }
        }

        boolean hasPermission = permissionService.checkPermission(userId, boardId, requirePermission.value());

        if (!hasPermission) {
            throw new AccessDeniedException("Insufficient permissions for this operation");
        }

        return joinPoint.proceed();
    }
}