CREATE TABLE categories (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category_name (name)
);

CREATE TABLE generation_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  quantity INT NOT NULL,
  seed VARCHAR(100),
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  INDEX idx_gen_status (status),
  INDEX idx_gen_created (created_at),
  INDEX idx_gen_status_created (status, created_at)
);

CREATE TABLE agents (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category_id BIGINT NOT NULL,
  generation_log_id BIGINT,
  status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_agents_category (category_id),
  INDEX idx_agents_status (status),
  INDEX idx_agents_category_status (category_id, status),
  INDEX idx_agents_generation (generation_log_id),
  INDEX idx_agents_created (created_at),
  CONSTRAINT fk_agents_category
    FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT fk_agents_generation
    FOREIGN KEY (generation_log_id) REFERENCES generation_logs(id)
);

CREATE TABLE agent_attributes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  agent_id BIGINT NOT NULL,
  attr_key VARCHAR(100) NOT NULL,
  attr_value TEXT,  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_attr_agent (agent_id),
  INDEX idx_attr_key (attr_key),
  INDEX idx_attr_agent_key (agent_id, attr_key),
  CONSTRAINT fk_attr_agent
    FOREIGN KEY (agent_id) REFERENCES agents(id)
    ON DELETE CASCADE,
  UNIQUE KEY uk_agent_attr (agent_id, attr_key)  
);