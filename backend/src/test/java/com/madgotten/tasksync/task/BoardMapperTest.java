package com.madgotten.tasksync.task;

import static org.junit.jupiter.api.Assertions.assertEquals;
/*
class BoardMapperTest {

    private TaskMapper mapper;

    @BeforeEach
    void setUp() {
        mapper = TaskMapper.INSTANCE;
    }

    @Test
    public void testMapTaskDtoToTask() {
        TaskDto taskDto = new TaskDto(
                "Test Name",
                "Test Description",
                TaskStatus.IN_PROGRESS
        );

        Task product = mapper.toTask(taskDto);

        assertEquals(taskDto.name(), product.getName());
        assertEquals(taskDto.description(), product.getDescription());
        assertEquals(taskDto.status(), product.getStatus());
    }

    @Test
    public void testMapProductToProductResponseDto() {
        Task product = new Task();
        product.setName("New Name");
        product.setDescription("New Description");
        product.setStatus(TaskStatus.COMPLETED);

        TaskResponseDto taskResponseDto = mapper.fromTask(product);

        assertEquals(product.getName(), taskResponseDto.name());
        assertEquals(product.getDescription(), taskResponseDto.description());
        assertEquals(product.getStatus(), taskResponseDto.status());
    }

}*/