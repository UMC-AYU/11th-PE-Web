package org.umc.umc11thspring.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.umc.umc11thspring.dto.BookCreateRequest;
import org.umc.umc11thspring.dto.BookResponse;
import org.umc.umc11thspring.entity.Book;
import org.umc.umc11thspring.entity.Category;
import org.umc.umc11thspring.exception.CategoryNotFoundException;
import org.umc.umc11thspring.repository.BookRepository;
import org.umc.umc11thspring.repository.CategoryRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public List<BookResponse> getBooks(String keyword) {
        List<Book> books = keyword == null || keyword.isBlank()
                ? bookRepository.findAllByOrderByBookIdDesc()
                : bookRepository.findByTitleContainingIgnoreCaseOrderByBookIdDesc(keyword.trim());

        return books.stream()
                .map(BookResponse::from)
                .toList();
    }

    public List<BookResponse> getBooksByCategory(Long categoryId) {
        return bookRepository.findByCategoryCategoryIdOrderByBookIdDesc(categoryId).stream()
                .map(BookResponse::from)
                .toList();
    }

    @Transactional
    public BookResponse createBook(BookCreateRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(request.categoryId()));

        Book book = Book.create(category, request.title().trim(), request.description());
        return BookResponse.from(bookRepository.save(book));
    }
}
