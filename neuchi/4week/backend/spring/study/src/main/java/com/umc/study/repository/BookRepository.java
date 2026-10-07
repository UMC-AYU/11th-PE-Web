// src/main/java/.../repository/BookRepository.java
package com.umc.study.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.umc.study.entity.Book;
import java.util.List;

    public interface BookRepository extends JpaRepository<Book, Long> {
        List<Book> findAllByOrderByBookIdDesc();
    }


