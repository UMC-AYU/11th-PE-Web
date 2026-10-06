package org.umc.umc11thspring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.umc.umc11thspring.entity.Book;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    @EntityGraph(attributePaths = "category")
    List<Book> findAllByOrderByBookIdDesc();

    @EntityGraph(attributePaths = "category")
    List<Book> findByTitleContainingIgnoreCaseOrderByBookIdDesc(String keyword);

    @EntityGraph(attributePaths = "category")
    List<Book> findByCategoryCategoryIdOrderByBookIdDesc(Long categoryId);
}
