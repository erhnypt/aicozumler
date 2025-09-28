-- AI Çözümler SaaS Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE subscription_plan AS ENUM ('free', 'basic', 'premium', 'enterprise');
CREATE TYPE tenant_status AS ENUM ('active', 'suspended', 'inactive');
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member', 'viewer');

-- Tenants table (multi-tenant support)
CREATE TABLE tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sector TEXT NOT NULL,
  domain TEXT,
  subdomain TEXT,
  
  -- Subscription info
  subscription_plan subscription_plan DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Limits based on plan
  max_users INTEGER DEFAULT 1,
  max_encrypted_items INTEGER DEFAULT 10,
  max_storage_mb INTEGER DEFAULT 100,
  
  -- Usage tracking
  current_users INTEGER DEFAULT 0,
  current_encrypted_items INTEGER DEFAULT 0,
  current_storage_mb INTEGER DEFAULT 0,
  
  -- Tenant settings
  settings JSONB DEFAULT '{}',
  branding JSONB DEFAULT '{}',
  
  -- Status
  status tenant_status DEFAULT 'active',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT valid_sector CHECK (sector IN ('dentist', 'beauty', 'restaurant', 'fitness', 'retail'))
);

-- Enhanced profiles table
DROP TABLE IF EXISTS profiles;
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Personal info
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  avatar_url TEXT,
  
  -- Role and permissions
  role user_role DEFAULT 'owner',
  permissions JSONB DEFAULT '{}',
  
  -- Subscription info (for personal accounts)
  subscription_plan subscription_plan DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Usage tracking (for personal accounts)
  usage_stats JSONB DEFAULT '{}',
  
  -- Settings
  preferences JSONB DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced encrypted_data table
DROP TABLE IF EXISTS encrypted_data;
CREATE TABLE encrypted_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Data info
  data_type TEXT NOT NULL,
  title TEXT,
  description TEXT,
  encrypted_content TEXT NOT NULL,
  
  -- Metadata
  tags TEXT[],
  category TEXT,
  is_favorite BOOLEAN DEFAULT false,
  
  -- Access control
  is_shared BOOLEAN DEFAULT false,
  shared_with UUID[],
  access_level TEXT DEFAULT 'private', -- 'private', 'shared', 'team'
  
  -- File info (if applicable)
  file_name TEXT,
  file_size INTEGER,
  file_type TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_data_type CHECK (data_type IN ('api_keys', 'personal_notes', 'payment_info', 'passwords', 'documents', 'custom')),
  CONSTRAINT valid_access_level CHECK (access_level IN ('private', 'shared', 'team'))
);

-- Tenant members table (for multi-user tenants)
CREATE TABLE tenant_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Role and permissions
  role user_role DEFAULT 'member',
  permissions JSONB DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'active', -- 'active', 'invited', 'suspended'
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(tenant_id, user_id)
);

-- Subscription history table
CREATE TABLE subscription_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Subscription info
  plan subscription_plan NOT NULL,
  status TEXT NOT NULL,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  
  -- Payment info
  payment_method TEXT,
  payment_provider TEXT, -- 'stripe', 'paddle', etc.
  payment_provider_id TEXT,
  
  -- Period
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage logs table (for analytics and billing)
CREATE TABLE usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Usage info
  action TEXT NOT NULL, -- 'create', 'read', 'update', 'delete', 'login', etc.
  resource_type TEXT, -- 'encrypted_data', 'api_call', etc.
  resource_id UUID,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_encrypted_data_user_id ON encrypted_data(user_id);
CREATE INDEX idx_encrypted_data_tenant_id ON encrypted_data(tenant_id);
CREATE INDEX idx_encrypted_data_data_type ON encrypted_data(data_type);
CREATE INDEX idx_encrypted_data_created_at ON encrypted_data(created_at DESC);
CREATE INDEX idx_tenant_members_tenant_id ON tenant_members(tenant_id);
CREATE INDEX idx_tenant_members_user_id ON tenant_members(user_id);
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_domain ON tenants(domain);
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_tenant_id ON usage_logs(tenant_id);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE encrypted_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Tenants policies
CREATE POLICY "Users can view tenants they belong to" ON tenants
  FOR SELECT USING (
    id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
      UNION
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Tenant owners can update their tenants" ON tenants
  FOR UPDATE USING (
    id IN (
      SELECT tenant_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Encrypted data policies
CREATE POLICY "Users can view own encrypted data" ON encrypted_data
  FOR SELECT USING (
    user_id = auth.uid() 
    OR 
    (is_shared = true AND auth.uid() = ANY(shared_with))
    OR
    (tenant_id IN (
      SELECT tenant_id FROM tenant_members 
      WHERE user_id = auth.uid() AND access_level = 'team'
    ))
  );

CREATE POLICY "Users can insert own encrypted data" ON encrypted_data
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own encrypted data" ON encrypted_data
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own encrypted data" ON encrypted_data
  FOR DELETE USING (user_id = auth.uid());

-- Tenant members policies
CREATE POLICY "Users can view tenant members of their tenants" ON tenant_members
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
      UNION
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );

-- Subscription history policies
CREATE POLICY "Users can view own subscription history" ON subscription_history
  FOR SELECT USING (
    user_id = auth.uid() 
    OR 
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Usage logs policies
CREATE POLICY "Users can view own usage logs" ON usage_logs
  FOR SELECT USING (
    user_id = auth.uid() 
    OR 
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_encrypted_data_updated_at BEFORE UPDATE ON encrypted_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenant_members_updated_at BEFORE UPDATE ON tenant_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update usage stats
CREATE OR REPLACE FUNCTION update_usage_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update tenant usage stats
  IF TG_OP = 'INSERT' THEN
    UPDATE tenants 
    SET current_encrypted_items = current_encrypted_items + 1,
        updated_at = NOW()
    WHERE id = NEW.tenant_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tenants 
    SET current_encrypted_items = current_encrypted_items - 1,
        updated_at = NOW()
    WHERE id = OLD.tenant_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update usage stats
CREATE TRIGGER update_encrypted_data_usage_stats
  AFTER INSERT OR DELETE ON encrypted_data
  FOR EACH ROW EXECUTE FUNCTION update_usage_stats();

-- Insert default tenant for existing users (optional)
-- You can customize this based on your needs
/*
INSERT INTO tenants (name, slug, sector, subscription_plan) VALUES
('Default Tenant', 'default', 'dentist', 'free');
*/
