package org.umc.umc11thspring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.umc.umc11thspring.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
