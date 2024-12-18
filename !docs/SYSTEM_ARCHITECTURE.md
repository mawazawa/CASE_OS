# CASE_OS System Architecture

## System Overview Diagram
```mermaid
graph TB
    User[User Interface Layer]
    PDT[Personal Data Trust]
    Graph[ΞGRAPH Evidence Layer]
    Forms[Form Processing Engine]
    Docs[Document Generation]
    
    User --> PDT
    User --> Forms
    PDT --> Graph
    Graph --> Forms
    Forms --> Docs
    
    subgraph "Data Sources"
        WhatsApp[WhatsApp Export]
        Camera[Camera Roll]
        Forms[Court Forms]
        Voice[Voice Input]
    end
    
    subgraph "Processing Layer"
        NLP[Natural Language Processing]
        OCR[OCR Engine]
        RAG[RAG Engine]
        Graph[Neo4j Graph DB]
    end
    
    WhatsApp --> NLP
    Camera --> OCR
    Forms --> OCR
    Voice --> NLP
    
    NLP --> RAG
    OCR --> RAG
    RAG --> Graph
```

## Personal Data Trust Schema
```mermaid
erDiagram
    PERSON ||--o{ IDENTITY : has
    PERSON ||--o{ CONTACT : has
    PERSON ||--o{ RELATIONSHIP : participates
    PERSON ||--o{ CASE : involved
    
    IDENTITY {
        string id PK
        string firstName
        string lastName
        date dateOfBirth
        string ssn
        string driversLicense
    }
    
    CONTACT {
        string id PK
        string type
        string value
        date validFrom
        date validTo
    }
    
    RELATIONSHIP {
        string id PK
        string type
        string status
        date startDate
        date endDate
    }
    
    CASE {
        string id PK
        string type
        string status
        string caseNumber
        date filingDate
    }
```

## ΞGRAPH Evidence Layer
```mermaid
graph LR
    E[Evidence Node]
    C[Claim Node]
    P[Person Node]
    T[Timeline Node]
    
    E -->|supports| C
    E -->|involves| P
    E -->|occurs_at| T
    C -->|made_by| P
    C -->|references| T
    
    subgraph Evidence Types
        W[WhatsApp Message]
        I[Image]
        V[Video]
        A[Audio]
        D[Document]
    end
    
    W -->|is_type| E
    I -->|is_type| E
    V -->|is_type| E
    A -->|is_type| E
    D -->|is_type| E
```

## Form Processing Flow
```mermaid
sequenceDiagram
    participant U as User
    participant A as AI Assistant
    participant P as PDT
    participant G as ΞGRAPH
    participant F as Form Engine
    
    U->>A: Start form completion
    A->>P: Fetch relevant data
    A->>G: Query evidence
    G->>A: Return supporting evidence
    A->>U: Request missing info
    U->>A: Provide info
    A->>F: Generate form packet
    F->>U: Present for review
```

## WhatsApp Integration Architecture
```mermaid
graph TB
    Export[WhatsApp Export]
    Parser[Message Parser]
    Analyzer[Content Analyzer]
    Evidence[Evidence Extractor]
    Graph[Neo4j Graph]
    
    Export -->|JSON/TXT| Parser
    Parser -->|Structured Data| Analyzer
    Analyzer -->|Relevant Content| Evidence
    Evidence -->|Relationships| Graph
    
    subgraph "Analysis Types"
        Temporal[Temporal Analysis]
        Semantic[Semantic Analysis]
        Entity[Entity Recognition]
        Pattern[Pattern Detection]
    end
    
    Analyzer --> Temporal
    Analyzer --> Semantic
    Analyzer --> Entity
    Analyzer --> Pattern
```

## Document Generation Pipeline
```mermaid
graph LR
    Input[Form Input]
    PDT[Personal Data Trust]
    Evidence[Evidence Layer]
    Template[Form Templates]
    Generator[Doc Generator]
    Output[Final Packet]
    
    Input --> Generator
    PDT --> Generator
    Evidence --> Generator
    Template --> Generator
    Generator --> Output
    
    subgraph "Output Types"
        PDF[PDF Package]
        Print[Print Ready]
        Digital[Digital Filing]
    end
    
    Output --> PDF
    Output --> Print
    Output --> Digital
```
