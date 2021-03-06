class ActionLog < ApplicationRecord

  belongs_to :student
  belongs_to :user

  before_save :backup_user_info
  before_save :backup_student_info

  def user_text
    self.user&.email || self.user_info.email || "NoUser"
  end

  def student_text
    self.student&.full_name || self.student_info.full_name || "NoStudent"
  end

  def logged_at
    self.created_at.to_datetime.new_offset("-05:00").strftime('%d/%m/%Y %H:%M:%S%P')
  end

  def to_s
    "#{self.user_text} #{self.action.downcase} a #{student}; motivo: #{self.content.downcase}"  
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
