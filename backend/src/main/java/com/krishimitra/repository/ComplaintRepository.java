package com.krishimitra.repository;

import com.krishimitra.entity.Complaint;
import com.krishimitra.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    Optional<Complaint> findByComplaintNumber(String complaintNumber);

    Page<Complaint> findByUser(User user, Pageable pageable);

    Page<Complaint> findByUserAndStatus(User user, Complaint.Status status, Pageable pageable);

    Page<Complaint> findByAssignedOfficer(User officer, Pageable pageable);

    Page<Complaint> findByAssignedOfficerAndStatus(User officer, Complaint.Status status, Pageable pageable);

    @Query("""
        SELECT c FROM Complaint c WHERE
        (:status IS NULL OR c.status = :status) AND
        (:priority IS NULL OR c.priority = :priority) AND
        (:category IS NULL OR c.category = :category) AND
        (:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%',:search,'%'))
            OR LOWER(c.description) LIKE LOWER(CONCAT('%',:search,'%')))
        """)
    Page<Complaint> findAllWithFilters(
        @Param("status") Complaint.Status status,
        @Param("priority") Complaint.Priority priority,
        @Param("category") Complaint.Category category,
        @Param("search") String search,
        Pageable pageable
    );

    @Query("""
        SELECT c FROM Complaint c WHERE c.user = :user AND
        (:status IS NULL OR c.status = :status) AND
        (:priority IS NULL OR c.priority = :priority) AND
        (:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%',:search,'%')))
        """)
    Page<Complaint> findByUserWithFilters(
        @Param("user") User user,
        @Param("status") Complaint.Status status,
        @Param("priority") Complaint.Priority priority,
        @Param("search") String search,
        Pageable pageable
    );

    long countByStatus(Complaint.Status status);
    long countByPriority(Complaint.Priority priority);
    long countByUser(User user);
    long countByUserAndStatus(User user, Complaint.Status status);
    long countByAssignedOfficer(User officer);
    long countByAssignedOfficerAndStatus(User officer, Complaint.Status status);

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.createdAt >= :since")
    long countSince(@Param("since") LocalDateTime since);

    @Query("""
        SELECT c FROM Complaint c
        WHERE c.status NOT IN (com.krishimitra.entity.Complaint.Status.RESOLVED,
                               com.krishimitra.entity.Complaint.Status.CLOSED)
        AND c.createdAt < :cutoff
        ORDER BY c.priority DESC, c.createdAt ASC
        """)
    List<Complaint> findOverdueComplaints(@Param("cutoff") LocalDateTime cutoff);

    @Query("SELECT c.category, COUNT(c) FROM Complaint c GROUP BY c.category")
    List<Object[]> countByCategory();

    @Query("SELECT c.status, COUNT(c) FROM Complaint c GROUP BY c.status")
    List<Object[]> countByStatusGroup();

    @Query("SELECT AVG(TIMESTAMPDIFF(HOUR, c.createdAt, c.resolvedAt)) FROM Complaint c WHERE c.resolvedAt IS NOT NULL")
    Double avgResolutionTimeHours();

    @Query("""
        SELECT c FROM Complaint c
        ORDER BY c.upvotes DESC, c.createdAt DESC
        """)
    Page<Complaint> findCommunityComplaints(Pageable pageable);

    @Query("""
        SELECT c FROM Complaint c WHERE
        LOWER(c.title) LIKE LOWER(CONCAT('%',:title,'%')) OR
        LOWER(c.description) LIKE LOWER(CONCAT('%',:desc,'%'))
        AND c.status != com.krishimitra.entity.Complaint.Status.CLOSED
        """)
    List<Complaint> findPotentialDuplicates(@Param("title") String title, @Param("desc") String description);
}
