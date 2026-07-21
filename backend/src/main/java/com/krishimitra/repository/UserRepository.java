package com.krishimitra.repository;

import com.krishimitra.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByMobile(String mobile);

    @Query("SELECT u FROM User u WHERE u.email = :identifier OR u.mobile = :identifier")
    Optional<User> findByEmailOrMobile(@Param("identifier") String email,
                                        @Param("identifier2") String mobile);

    // Fix: use proper OR query
    @Query("SELECT u FROM User u WHERE u.email = :val OR u.mobile = :val")
    Optional<User> findByEmailOrMobile(@Param("val") String val, @Param("val") String val2);

    boolean existsByEmail(String email);
    boolean existsByMobile(String mobile);

    Page<User> findByRole(User.Role role, Pageable pageable);

    Page<User> findByRoleAndActiveTrue(User.Role role, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = :role AND " +
           "(LOWER(u.fullName) LIKE LOWER(CONCAT('%',:search,'%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%',:search,'%')))")
    Page<User> searchByRole(@Param("role") User.Role role,
                             @Param("search") String search,
                             Pageable pageable);

    @Modifying
    @Query("UPDATE User u SET u.lastLogin = CURRENT_TIMESTAMP WHERE u.id = :id")
    void updateLastLogin(@Param("id") Long id);

    long countByRole(User.Role role);

    long countByRoleAndActiveTrue(User.Role role);
}
