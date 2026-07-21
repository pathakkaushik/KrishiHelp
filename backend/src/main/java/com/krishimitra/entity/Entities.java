package com.krishimitra.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

// ─── Complaint Attachment ────────────────────────────────────────────────────

@Entity
@Table(name = "complaint_attachments")
@EntityListeners(AuditingEntityListener.class)
@Data @NoArgsConstructor @AllArgsConstructor @Builder
class ComplaintAttachmentDef {
    // Defined in ComplaintAttachment.java
}
