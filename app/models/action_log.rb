class ActionLog < ApplicationRecord

  belongs_to :student
  belongs_to :user

  before_save :backup_user_info
  before_save :backup_student_info

  def to_s
    user = self.user&.email || self.user_info.email || "NoUser"
    student = self.student&.full_name || self.student_info.full_name || "NoStudent"
    "#{user.strip} #{self.action.downcase} a #{student.strip}; motivo: #{self.content.downcase}"  
  end

  private

    def backup_user_info
      self.user_info = {
        id: self.user.id,
        email: self.user.email,
        role: self.user.role
      }
    end

    def backup_student_info
      self.student_info = {
        id: self.student.id,
        email: self.student.email,
        full_name: self.student.full_name
      }
    end
end
