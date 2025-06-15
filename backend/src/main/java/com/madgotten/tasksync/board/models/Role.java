package com.madgotten.tasksync.board.models;

public enum Role {
    ADMIN(20),
    MEMBER(15),
    GUEST(5);

    private final int level;

    Role(int level) {
        this.level = level;
    }

    public int getLevel() {
        return level;
    }

    public boolean hasMinimumLevel(Role role) {
        return this.level >= role.getLevel();
    }
}
