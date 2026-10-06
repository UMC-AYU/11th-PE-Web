package org.umc.umc11thspring;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class BookApiIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getBooksReturnsLatestBooksWithCategoryName() throws Exception {
        MvcResult result = mockMvc.perform(get("/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].bookId", notNullValue()))
                .andExpect(jsonPath("$[0].title", notNullValue()))
                .andExpect(jsonPath("$[0].categoryName", notNullValue()))
                .andExpect(jsonPath("$[0].isAvailable", notNullValue()))
                .andReturn();

        JsonNode books = objectMapper.readTree(result.getResponse().getContentAsString());
        for (int index = 1; index < books.size(); index++) {
            long previousBookId = books.get(index - 1).get("bookId").asLong();
            long currentBookId = books.get(index).get("bookId").asLong();
            assertTrue(previousBookId > currentBookId, "도서 목록은 ID 내림차순이어야 합니다.");
        }
    }

    @Test
    void createBookReturns201AndCreatedBook() throws Exception {
        String title = "ORM 테스트 도서 " + UUID.randomUUID();

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 1,
                                  "title": "%s",
                                  "description": "JPA 등록 테스트"
                                }
                                """.formatted(title)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookId", notNullValue()))
                .andExpect(jsonPath("$.title").value(title))
                .andExpect(jsonPath("$.categoryName", notNullValue()))
                .andExpect(jsonPath("$.isAvailable").value(true));
    }

    @Test
    void createBookReturns400WhenTitleIsBlank() throws Exception {
        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 1,
                                  "title": " ",
                                  "description": "잘못된 요청"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.fieldErrors.title").value("title은 필수입니다."));
    }

    @Test
    void createBookReturns404WhenCategoryDoesNotExist() throws Exception {
        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 999999,
                                  "title": "없는 카테고리 테스트",
                                  "description": "예외 테스트"
                                }
                                """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("CATEGORY_NOT_FOUND"));
    }

    @Test
    void searchBooksByTitleKeyword() throws Exception {
        mockMvc.perform(get("/books").param("keyword", "클린"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("클린 코드"));
    }
}
